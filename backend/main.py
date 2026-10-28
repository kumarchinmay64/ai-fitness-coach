import os
from contextlib import asynccontextmanager
import time
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
)
from rag import ask_rag, retrieve


def _log_api(stage: str, message: str, **kwargs):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    extra = (" | " + " ".join(f"{k}={v}" for k, v in kwargs.items())) if kwargs else ""
    print(f"[{now_str}] [Backend API] [{stage}] {message}{extra}", flush=True)


# ==================================================
# DATABASE INITIALIZATION & DEFAULT SEEDING
# ==================================================

def init_db():
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        # Schema migration: ensure any added columns exist on existing meal_logs table
        try:
            conn = db.connection()
            result = conn.execute(text("PRAGMA table_info(meal_logs);")).fetchall()
            col_names = [r[1] for r in result]
            if "slot_id" not in col_names:
                conn.execute(text("ALTER TABLE meal_logs ADD COLUMN slot_id VARCHAR(50);"))
            if "prep_time" not in col_names:
                conn.execute(text("ALTER TABLE meal_logs ADD COLUMN prep_time VARCHAR(50) DEFAULT '10 mins';"))
            if "instructions" not in col_names:
                conn.execute(text("ALTER TABLE meal_logs ADD COLUMN instructions TEXT;"))
            if "image_note" not in col_names:
                conn.execute(text("ALTER TABLE meal_logs ADD COLUMN image_note VARCHAR(255);"))
            db.commit()
        except Exception as mig_err:
            print(f"Migration notice: {mig_err}")
        # Seed default admin if missing (matching AdminLoginPage quick fill)
        admin = db.query(models.User).filter(models.User.email == "admin@pulseai.com").first()
        if not admin:
            admin = models.User(
                name="Platform Operations Admin",
                email="admin@pulseai.com",
                hashed_password=hash_password("PulseAdmin2025!"),
                role="admin",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
                status="Active",
            )
            db.add(admin)
        else:
            # Update password hash in case it was seeded with placeholder
            admin.hashed_password = hash_password("PulseAdmin2025!")
            admin.role = "admin"

        # Seed demo user if missing (matching LoginPage demo fill)
        athlete = db.query(models.User).filter(models.User.email == "athlete@pulseai.com").first()
        if not athlete:
            athlete = models.User(
                name="Alex Rivera",
                email="athlete@pulseai.com",
                hashed_password=hash_password("athlete123"),
                role="user",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
                status="Active",
            )
            db.add(athlete)
            db.flush()

            # Seed demo health profile
            profile = models.HealthProfile(
                user_id=athlete.id,
                age=25,
                gender="Male",
                height_cm=178.0,
                weight_kg=75.0,
                fitness_level="Beginner",
                goal="Hypertrophy & Posture Correction",
                workout_frequency=4,
                equipment="Dumbbells & Bodyweight",
                injuries="None",
            )
            db.add(profile)
        else:
            athlete.hashed_password = hash_password("athlete123")

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Database seed notice: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    try:
        print("Pre-warming RAG index and embedding model at application startup...")
        _ = retrieve("warmup", k=1)
        print("RAG index and embedding model ready.")
    except Exception as e:
        print(f"RAG warmup notice: {e}")
    yield


app = FastAPI(title="AI Fitness Coach API", lifespan=lifespan)

# Allow local Vite dev servers and loopback addresses
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# SCHEMAS
# ==================================================

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class HealthProfileRequest(BaseModel):
    age: Optional[int] = 25
    gender: Optional[str] = "Male"
    heightCm: Optional[float] = 178.0
    weightKg: Optional[float] = 75.0
    fitnessLevel: Optional[str] = "Beginner"
    goal: Optional[str] = "Hypertrophy & Posture Correction"
    workoutFrequency: Optional[int] = 4
    equipment: Optional[str] = "Dumbbells & Bodyweight"
    injuries: Optional[str] = "None"


class WorkoutSessionRequest(BaseModel):
    exerciseName: str
    reps: int = 0
    sets: Optional[int] = 1
    totalDurationSeconds: Optional[int] = 0
    accuracy: Optional[float] = 90.0
    calories: Optional[float] = 0.0


class ChatRequest(BaseModel):
    message: str
    profile: Optional[Dict[str, Any]] = None
    # Reliability summary of the last workout (schema "session-reliability/1"), optional
    session: Optional[Dict[str, Any]] = None


class MealLogRequest(BaseModel):
    slotId: Optional[str] = None
    category: Optional[str] = "Custom"
    name: str
    calories: float = 0.0
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fat: Optional[float] = 0.0
    prepTime: Optional[str] = "10 mins"
    instructions: Optional[str] = None
    imageNote: Optional[str] = None
    date: Optional[str] = None


class WaterUpdateRequest(BaseModel):
    glasses: int
    date: Optional[str] = None


class NutritionTargetsRequest(BaseModel):
    calories: float
    proteinGrams: float
    carbsGrams: float
    fatGrams: float
    targetGlasses: Optional[int] = 10
    date: Optional[str] = None


class DietPreferenceRequest(BaseModel):
    dietPreference: str
    date: Optional[str] = None


class NutritionDateRequest(BaseModel):
    date: Optional[str] = None


class UserStatusUpdateRequest(BaseModel):
    status: Optional[str] = None  # 'Active' or 'Suspended'


class AdminCreateAthleteRequest(BaseModel):
    name: str
    email: str
    goal: Optional[str] = "Hypertrophy & Posture Correction"
    password: Optional[str] = "Athlete2025!"


# ==================================================
# ROOT & CHAT ENDPOINTS (PRESERVED)
# ==================================================

@app.get("/")
def root():
    return {"message": "AI Fitness Coach API is running", "database": "active"}


@app.post("/chat")
def chat(request: ChatRequest):
    t_start = time.time()
    _log_api("ENDPOINT_ENTER", "Endpoint /chat entered", msg_length=len(request.message or ""))
    try:
        answer, metadata = ask_rag(
            question=request.message,
            profile=request.profile,
            return_metadata=True,
            session=request.session,
        )
        total_ms = (time.time() - t_start) * 1000
        _log_api("RESPONSE_RETURN", f"Final response returned to frontend in {total_ms:.2f}ms", duration_ms=f"{total_ms:.2f}")
        return {
            "answer": answer,
            "timings": metadata.get("timings", {}),
            "sources": metadata.get("sources", []),
        }
    except Exception as e:
        total_ms = (time.time() - t_start) * 1000
        _log_api("ENDPOINT_ERROR", f"Error in /chat after {total_ms:.2f}ms: {e}")
        raise HTTPException(
            status_code=503,
            detail="I am currently unable to generate an evidence-supported answer because the AI reasoning service timed out or was temporarily unavailable. Please try again in a moment."
        )


# ==================================================
# AUTHENTICATION ENDPOINTS
# ==================================================

@app.post("/api/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    if not clean_email or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid email and password are required.",
        )

    existing = db.query(models.User).filter(models.User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    user = models.User(
        name=payload.name.strip() or "Athlete",
        email=clean_email,
        hashed_password=hash_password(payload.password),
        role="user",
        status="Active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "user": user.to_dict(),
        "access_token": token,
        "token_type": "bearer",
    }


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.status == "Suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended. Please contact platform administration.",
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "user": user.to_dict(),
        "access_token": token,
        "token_type": "bearer",
    }


@app.post("/api/auth/admin-login")
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    clean_email = payload.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid staff credentials.",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Account does not have administrator privileges.",
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": "admin"})
    return {
        "admin": user.to_dict(),
        "access_token": token,
        "token_type": "bearer",
    }


@app.get("/api/auth/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "user": current_user.to_dict()
    }


# ==================================================
# ONBOARDING & PROFILE ENDPOINTS
# ==================================================

@app.get("/api/onboarding/profile")
def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.HealthProfile).filter(models.HealthProfile.user_id == current_user.id).first()
    if not profile:
        return {
            "age": 25,
            "gender": "Male",
            "heightCm": 178,
            "weightKg": 75,
            "fitnessLevel": "Beginner",
            "goal": "Hypertrophy & Posture Correction",
            "workoutFrequency": 4,
            "equipment": "Dumbbells & Bodyweight",
            "injuries": "None",
        }
    return profile.to_dict()


@app.post("/api/onboarding/profile")
def save_profile(
    payload: HealthProfileRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.HealthProfile).filter(models.HealthProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.HealthProfile(user_id=current_user.id)
        db.add(profile)

    profile.age = payload.age
    profile.gender = payload.gender
    profile.height_cm = payload.heightCm
    profile.weight_kg = payload.weightKg
    profile.fitness_level = payload.fitnessLevel
    profile.goal = payload.goal
    profile.workout_frequency = payload.workoutFrequency
    profile.equipment = payload.equipment
    profile.injuries = payload.injuries

    db.commit()
    db.refresh(profile)
    return profile.to_dict()


# ==================================================
# WORKOUT SESSIONS & HISTORY ENDPOINTS
# ==================================================

@app.post("/api/workouts/session")
def record_session(
    payload: WorkoutSessionRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    calories = payload.calories
    if not calories or calories <= 0:
        calories = round(payload.reps * 0.8, 1)

    session_record = models.WorkoutSession(
        user_id=current_user.id,
        exercise_name=payload.exerciseName,
        reps=payload.reps,
        sets=payload.sets or 1,
        duration_seconds=payload.totalDurationSeconds or 0,
        accuracy=payload.accuracy if payload.accuracy is not None else 90.0,
        calories=calories,
    )
    db.add(session_record)
    db.commit()
    db.refresh(session_record)
    return session_record.to_dict()


@app.get("/api/workouts/history")
def get_workout_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(models.WorkoutSession)
        .filter(models.WorkoutSession.user_id == current_user.id)
        .order_by(models.WorkoutSession.created_at.desc())
        .limit(50)
        .all()
    )
    return [s.to_dict() for s in sessions]


@app.get("/api/analytics/user")
def get_user_analytics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(models.WorkoutSession)
        .filter(models.WorkoutSession.user_id == current_user.id)
        .order_by(models.WorkoutSession.created_at.desc())
        .all()
    )
    total_workouts = len(sessions)
    total_reps_logged = sum(s.reps for s in sessions)
    average_accuracy = (
        round(sum(s.accuracy for s in sessions) / total_workouts)
        if total_workouts > 0
        else None
    )
    calories_burned_week = sum(s.calories for s in sessions)
    streak_days = min(total_workouts, 7) if total_workouts > 0 else 0

    # Trend from recent recorded sessions
    recent_trend = sessions[:7]
    form_accuracy_trend = [
        {"day": f"Session {i + 1}", "score": round(s.accuracy)}
        for i, s in enumerate(reversed(recent_trend))
    ]

    # Rep distribution by exercise
    rep_map = {}
    for s in sessions:
        name = s.exercise_name or "Squats"
        rep_map[name] = rep_map.get(name, 0) + s.reps

    rep_distribution = [
        {"exercise": k, "reps": v} for k, v in rep_map.items()
    ]

    # Weight from profile or default
    profile = db.query(models.HealthProfile).filter(models.HealthProfile.user_id == current_user.id).first()
    weight = profile.weight_kg if profile else 75.0

    return {
        "streakDays": streak_days,
        "totalWorkouts": total_workouts,
        "totalRepsLogged": total_reps_logged,
        "averageAccuracy": average_accuracy,
        "caloriesBurnedWeek": round(calories_burned_week),
        "hasData": total_workouts > 0,
        "weeklyFrequency": [
            {"week": "Wk 1", "sessions": min(total_workouts, 4), "target": 4},
            {"week": "Wk 2", "sessions": 0, "target": 4},
            {"week": "Wk 3", "sessions": 0, "target": 4},
            {"week": "Wk 4", "sessions": 0, "target": 4},
        ],
        "repDistribution": rep_distribution,
        "formAccuracyTrend": form_accuracy_trend,
        "weightTrend": [
            {"week": "Start", "weight": weight},
            {"week": "Current", "weight": weight},
        ],
    }


# ==================================================
# NUTRITION & MEAL TRACKING ENDPOINTS
# ==================================================

DEFAULT_MEAL_SLOT_DEFS = [
    {
        "id": "slot-breakfast",
        "category": "Breakfast",
        "slotTime": "08:00 AM",
        "defaultImageNote": "Slot available: Log whole eggs, oatmeal, fruit, or protein shake",
        "defaultInstructions": 'Tap "Log Meal" to add your morning fuel.',
    },
    {
        "id": "slot-lunch",
        "category": "Lunch",
        "slotTime": "01:00 PM",
        "defaultImageNote": "Slot available: Log lean poultry, grains, greens, and healthy fats",
        "defaultInstructions": 'Tap "Log Meal" to record your midday meal.',
    },
    {
        "id": "slot-snack",
        "category": "Afternoon Fuel",
        "slotTime": "04:30 PM",
        "defaultImageNote": "Slot available: Greek yogurt, raw almonds, protein bar, or fruit",
        "defaultInstructions": 'Tap "Log Meal" to add pre-workout fuel.',
    },
    {
        "id": "slot-dinner",
        "category": "Dinner",
        "slotTime": "08:00 PM",
        "defaultImageNote": "Slot available: Fish, lean beef, roasted vegetables, and complex carbs",
        "defaultInstructions": 'Tap "Log Meal" to record your evening dinner.',
    },
]


def validate_nutrition_date(date_str: Optional[str]) -> str:
    if not date_str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")
    clean = date_str.strip()
    try:
        parsed = datetime.strptime(clean, "%Y-%m-%d")
        return parsed.strftime("%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Expected YYYY-MM-DD.",
        )


def get_or_create_daily_nutrition(user_id: int, date_str: str, db: Session) -> models.DailyNutrition:
    daily = (
        db.query(models.DailyNutrition)
        .filter(models.DailyNutrition.user_id == user_id, models.DailyNutrition.date == date_str)
        .first()
    )
    if not daily:
        # Check if user has an existing daily record to inherit preferred targets
        latest = (
            db.query(models.DailyNutrition)
            .filter(models.DailyNutrition.user_id == user_id)
            .order_by(models.DailyNutrition.id.desc())
            .first()
        )
        target_cal = latest.target_calories if latest else 2200.0
        target_pro = latest.target_protein if latest else 160.0
        target_carb = latest.target_carbs if latest else 220.0
        target_fat = latest.target_fat if latest else 65.0
        target_gl = latest.target_glasses if latest else 10
        diet_pref = latest.diet_preference if latest else "High Protein"

        daily = models.DailyNutrition(
            user_id=user_id,
            date=date_str,
            water_glasses=0,
            target_glasses=target_gl,
            target_calories=target_cal,
            target_protein=target_pro,
            target_carbs=target_carb,
            target_fat=target_fat,
            diet_preference=diet_pref,
        )
        db.add(daily)
        db.commit()
        db.refresh(daily)
    return daily


def build_user_nutrition_response(user_id: int, date_str: str, db: Session) -> dict:
    daily = get_or_create_daily_nutrition(user_id, date_str, db)
    meals = (
        db.query(models.MealLog)
        .filter(models.MealLog.user_id == user_id, models.MealLog.date == date_str)
        .order_by(models.MealLog.id.asc())
        .all()
    )

    tot_cal = sum(m.calories for m in meals)
    tot_pro = sum(m.protein for m in meals)
    tot_carb = sum(m.carbs for m in meals)
    tot_fat = sum(m.fat for m in meals)

    meals_by_slot = {}
    custom_meals = []
    standard_slot_ids = {s["id"] for s in DEFAULT_MEAL_SLOT_DEFS}

    for m in meals:
        if m.slot_id and m.slot_id in standard_slot_ids:
            meals_by_slot[m.slot_id] = m
        else:
            custom_meals.append(m)

    rendered_slots = []
    for sdef in DEFAULT_MEAL_SLOT_DEFS:
        slot_id = sdef["id"]
        if slot_id in meals_by_slot:
            m = meals_by_slot[slot_id]
            rendered_slots.append({
                "id": slot_id,
                "numericId": m.id,
                "category": m.category or sdef["category"],
                "slotTime": sdef["slotTime"],
                "name": m.name,
                "calories": m.calories,
                "protein": m.protein,
                "carbs": m.carbs,
                "fat": m.fat,
                "prepTime": m.prep_time or "10 mins",
                "completed": True,
                "isSlotOpen": False,
                "imageNote": m.image_note or "Logged by user.",
                "instructions": m.instructions or "Custom logged meal.",
            })
        else:
            rendered_slots.append({
                "id": slot_id,
                "category": sdef["category"],
                "slotTime": sdef["slotTime"],
                "name": f"{sdef['category']} Slot",
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "prepTime": "--",
                "completed": False,
                "isSlotOpen": True,
                "imageNote": sdef["defaultImageNote"],
                "instructions": sdef["defaultInstructions"],
            })

    for cm in custom_meals:
        rendered_slots.append(cm.to_dict())

    return {
        "date": date_str,
        "dailyTargets": {
            "calories": round(daily.target_calories),
            "proteinGrams": round(daily.target_protein),
            "carbsGrams": round(daily.target_carbs),
            "fatGrams": round(daily.target_fat),
            "waterLiters": round(daily.target_glasses * 0.25, 1),
            "targetGlasses": daily.target_glasses,
        },
        "currentConsumed": {
            "calories": round(tot_cal),
            "proteinGrams": round(tot_pro),
            "carbsGrams": round(tot_carb),
            "fatGrams": round(tot_fat),
            "waterGlasses": daily.water_glasses,
            "targetGlasses": daily.target_glasses,
        },
        "dietPreference": daily.diet_preference,
        "activeDietOptions": ["High Protein", "Balanced", "Keto", "Plant-Based / Vegan", "Paleo"],
        "meals": rendered_slots,
    }


@app.get("/api/nutrition/daily")
def get_daily_nutrition(
    date: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(date)
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.get("/api/nutrition/profile")
def get_nutrition_profile(
    date: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(date)
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.post("/api/nutrition/meal")
def record_meal(
    payload: MealLogRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    clean_name = payload.name.strip()
    if not clean_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meal name is required.",
        )

    if (
        payload.calories < 0
        or (payload.protein is not None and payload.protein < 0)
        or (payload.carbs is not None and payload.carbs < 0)
        or (payload.fat is not None and payload.fat < 0)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Macronutrient and calorie values cannot be negative.",
        )

    slot_id = payload.slotId.strip() if payload.slotId else None
    standard_slot_ids = {s["id"] for s in DEFAULT_MEAL_SLOT_DEFS}

    meal = None
    if slot_id and slot_id in standard_slot_ids:
        meal = (
            db.query(models.MealLog)
            .filter(
                models.MealLog.user_id == current_user.id,
                models.MealLog.date == date_str,
                models.MealLog.slot_id == slot_id,
            )
            .first()
        )

    if not meal:
        meal = models.MealLog(
            user_id=current_user.id,
            slot_id=slot_id or f"meal-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            category=payload.category or "Custom",
            name=clean_name,
            calories=payload.calories,
            protein=payload.protein or 0.0,
            carbs=payload.carbs or 0.0,
            fat=payload.fat or 0.0,
            prep_time=payload.prepTime or "10 mins",
            instructions=payload.instructions,
            image_note=payload.imageNote,
            date=date_str,
        )
        db.add(meal)
    else:
        meal.name = clean_name
        meal.category = payload.category or meal.category
        meal.calories = payload.calories
        meal.protein = payload.protein or 0.0
        meal.carbs = payload.carbs or 0.0
        meal.fat = payload.fat or 0.0
        if payload.prepTime:
            meal.prep_time = payload.prepTime
        if payload.instructions:
            meal.instructions = payload.instructions
        if payload.imageNote:
            meal.image_note = payload.imageNote

    db.commit()
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.delete("/api/nutrition/meal/{meal_id}")
def delete_meal(
    meal_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal = (
        db.query(models.MealLog)
        .filter(
            models.MealLog.id == meal_id,
            models.MealLog.user_id == current_user.id,
        )
        .first()
    )
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal entry not found or unauthorized.",
        )
    date_str = meal.date
    db.delete(meal)
    db.commit()
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.post("/api/nutrition/water")
def update_water(
    payload: WaterUpdateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    if payload.glasses < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Water glasses cannot be negative.",
        )
    if payload.glasses > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Water intake cannot exceed 50 glasses.",
        )

    daily = get_or_create_daily_nutrition(current_user.id, date_str, db)
    daily.water_glasses = payload.glasses
    db.commit()
    return {
        "date": date_str,
        "waterGlasses": daily.water_glasses,
        "targetGlasses": daily.target_glasses,
        "waterLiters": round(daily.water_glasses * 0.25, 1),
    }


@app.post("/api/nutrition/targets")
def update_nutrition_targets(
    payload: NutritionTargetsRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    if (
        payload.calories <= 0
        or payload.proteinGrams <= 0
        or payload.carbsGrams <= 0
        or payload.fatGrams <= 0
        or (payload.targetGlasses is not None and payload.targetGlasses <= 0)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target nutritional values must be positive numbers.",
        )

    daily = get_or_create_daily_nutrition(current_user.id, date_str, db)
    daily.target_calories = payload.calories
    daily.target_protein = payload.proteinGrams
    daily.target_carbs = payload.carbsGrams
    daily.target_fat = payload.fatGrams
    if payload.targetGlasses:
        daily.target_glasses = payload.targetGlasses
    db.commit()
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.post("/api/nutrition/diet-preference")
def update_diet_preference(
    payload: DietPreferenceRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    valid_diets = ["High Protein", "Balanced", "Keto", "Plant-Based / Vegan", "Paleo"]
    if payload.dietPreference not in valid_diets:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid diet preference. Must be one of {valid_diets}",
        )

    daily = get_or_create_daily_nutrition(current_user.id, date_str, db)
    daily.diet_preference = payload.dietPreference
    db.commit()
    return {"dietPreference": daily.diet_preference}


@app.post("/api/nutrition/sample-plan")
def load_sample_plan(
    payload: NutritionDateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    standard_slot_ids = [s["id"] for s in DEFAULT_MEAL_SLOT_DEFS]
    db.query(models.MealLog).filter(
        models.MealLog.user_id == current_user.id,
        models.MealLog.date == date_str,
        models.MealLog.slot_id.in_(standard_slot_ids),
    ).delete(synchronize_session=False)

    sample_items = [
        {
            "slot_id": "slot-breakfast",
            "category": "Breakfast",
            "name": "Power Oats with Whey & Blueberries",
            "calories": 480.0,
            "protein": 38.0,
            "carbs": 58.0,
            "fat": 10.0,
            "prep_time": "10 mins",
            "instructions": "Cook oats with water or almond milk. Stir in whey off heat, top with fresh berries.",
            "image_note": "Rolled oats, 1 scoop whey protein isolate, fresh blueberries, chia seeds",
        },
        {
            "slot_id": "slot-lunch",
            "category": "Lunch",
            "name": "Grilled Chicken & Quinoa Bowl",
            "calories": 620.0,
            "protein": 52.0,
            "carbs": 55.0,
            "fat": 16.0,
            "prep_time": "20 mins",
            "instructions": "Season chicken breast with paprika and black pepper. Serve over cooked quinoa and broccoli.",
            "image_note": "180g grilled chicken breast, fluffy tricolor quinoa, steamed broccoli, olive oil drizzle",
        },
        {
            "slot_id": "slot-snack",
            "category": "Afternoon Fuel",
            "name": "Greek Yogurt & Raw Almonds",
            "calories": 280.0,
            "protein": 24.0,
            "carbs": 18.0,
            "fat": 12.0,
            "prep_time": "3 mins",
            "instructions": "Stir Greek yogurt with cinnamon and top with raw almonds.",
            "image_note": "Non-fat strained Greek yogurt, 15g raw almonds, dash of cinnamon",
        },
        {
            "slot_id": "slot-dinner",
            "category": "Dinner",
            "name": "Pan-Seared Salmon & Roasted Sweet Potato",
            "calories": 580.0,
            "protein": 44.0,
            "carbs": 45.0,
            "fat": 22.0,
            "prep_time": "25 mins",
            "instructions": "Pan sear salmon for 4 minutes per side. Bake sweet potato wedges at 200°C until tender.",
            "image_note": "170g wild salmon fillet, baked sweet potato wedges, sautéed spinach with garlic",
        },
    ]

    for item in sample_items:
        meal = models.MealLog(
            user_id=current_user.id,
            slot_id=item["slot_id"],
            category=item["category"],
            name=item["name"],
            calories=item["calories"],
            protein=item["protein"],
            carbs=item["carbs"],
            fat=item["fat"],
            prep_time=item["prep_time"],
            instructions=item["instructions"],
            image_note=item["image_note"],
            date=date_str,
        )
        db.add(meal)

    daily = get_or_create_daily_nutrition(current_user.id, date_str, db)
    daily.water_glasses = 4
    db.commit()
    return build_user_nutrition_response(current_user.id, date_str, db)


@app.post("/api/nutrition/reset")
def reset_nutrition_slots(
    payload: NutritionDateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    date_str = validate_nutrition_date(payload.date)
    db.query(models.MealLog).filter(
        models.MealLog.user_id == current_user.id,
        models.MealLog.date == date_str,
    ).delete(synchronize_session=False)

    daily = get_or_create_daily_nutrition(current_user.id, date_str, db)
    daily.water_glasses = 0
    db.commit()
    return build_user_nutrition_response(current_user.id, date_str, db)


# ==================================================
# ADMIN PLATFORM MANAGEMENT ENDPOINTS
# ==================================================

@app.get("/api/admin/users")
def get_admin_users(
    search: Optional[str] = None,
    status: Optional[str] = None,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(models.User).order_by(models.User.id.asc())

    if status and status.lower() != "all":
        query = query.filter(models.User.status.ilike(status))

    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            (models.User.name.ilike(term)) | (models.User.email.ilike(term))
        )

    users = query.all()
    return [u.to_admin_dict() for u in users]


@app.post("/api/admin/users/{user_id}/status")
def update_user_status(
    user_id: str,
    payload: Optional[UserStatusUpdateRequest] = None,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    # Parse numeric id from string or 'usr-123'
    clean_id_str = user_id.replace("usr-", "").strip()
    try:
        numeric_id = int(clean_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user identifier format.",
        )

    target_user = db.query(models.User).filter(models.User.id == numeric_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )

    # Protect against admin self-suspension
    if target_user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot suspend their own account.",
        )

    if payload and payload.status:
        desired_status = payload.status.strip().capitalize()
        if desired_status not in ["Active", "Suspended"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be either 'Active' or 'Suspended'.",
            )
        target_user.status = desired_status
    else:
        # Toggle
        target_user.status = "Suspended" if target_user.status == "Active" else "Active"

    db.commit()
    db.refresh(target_user)
    return target_user.to_admin_dict()


@app.post("/api/admin/athletes")
def admin_create_athlete(
    payload: AdminCreateAthleteRequest,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    clean_name = payload.name.strip()
    if not clean_email or not clean_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and email are required.",
        )

    existing = db.query(models.User).filter(models.User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    new_user = models.User(
        name=clean_name,
        email=clean_email,
        hashed_password=hash_password(payload.password or "Athlete2025!"),
        role="user",
        status="Active",
    )
    db.add(new_user)
    db.flush()

    profile = models.HealthProfile(
        user_id=new_user.id,
        goal=payload.goal or "Hypertrophy & Posture Correction",
        fitness_level="Beginner",
        workout_frequency=4,
    )
    db.add(profile)
    db.commit()
    db.refresh(new_user)
    return new_user.to_admin_dict()


@app.get("/api/admin/analytics")
def get_admin_system_analytics(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    all_users = db.query(models.User).all()
    athletes = [u for u in all_users if u.role == "user"]
    active_athletes = len([u for u in athletes if u.status == "Active"])
    suspended_athletes = len([u for u in all_users if u.status == "Suspended"])
    total_workouts = db.query(models.WorkoutSession).count()
    total_meals = db.query(models.MealLog).count()

    return {
        "activeAthletes": active_athletes,
        "totalAthletes": len(athletes),
        "suspendedAthletes": suspended_athletes,
        "totalWorkouts": total_workouts,
        "totalMealsLogged": total_meals,
        "platformVersion": "v2.0.0-database",
        "databaseEngine": "SQLite (SQLAlchemy Engine + bcrypt)",
        "hardwareDiagnostics": [
            {
                "component": "Webcam Stream Engine",
                "status": "Operational",
                "detail": "MediaPipe Pose Landmarker / Wasm GPU Pipeline",
            },
            {
                "component": "Joint Kinematic Analyzer",
                "status": "Operational",
                "detail": "Vector Angle Math & Hysteresis Smoothing Engine",
            },
            {
                "component": "AI Biometric RAG Service",
                "status": "Operational",
                "detail": "FAISS Index (123 Chunks) + Google Gemini API Fallback",
            },
            {
                "component": "Database Storage Engine",
                "status": "Operational",
                "detail": "SQLite Database with Scoped Relational Isolation",
            },
        ],
        "movementCatalogStats": [
            {
                "category": "Legs",
                "exerciseCount": 2,
                "keyMovements": "Barbell Deep Squat, Walking Lunges",
            },
            {
                "category": "Chest & Arms",
                "exerciseCount": 2,
                "keyMovements": "Chest Push-Ups, Dumbbell Bicep Curls",
            },
            {
                "category": "Back & Core",
                "exerciseCount": 2,
                "keyMovements": "Romanian Deadlifts, Isometric Plank",
            },
        ],
    }


@app.get("/api/admin/activity")
def get_admin_activity_logs(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    logs = []

    # 1. Recent workouts
    recent_workouts = (
        db.query(models.WorkoutSession)
        .order_by(models.WorkoutSession.created_at.desc())
        .limit(20)
        .all()
    )
    for w in recent_workouts:
        logs.append({
            "id": f"act-w-{w.id}",
            "type": "WORKOUT_COMPLETED",
            "title": f"{w.exercise_name} session completed",
            "detail": f"{w.reps} reps recorded with {round(w.accuracy)}% form accuracy score",
            "time": w.created_at.strftime("%Y-%m-%d %H:%M UTC") if w.created_at else "Recently",
            "severity": "success",
            "rawTime": w.created_at or datetime.now(timezone.utc),
        })

    # 2. Recent user registrations
    recent_users = (
        db.query(models.User)
        .order_by(models.User.created_at.desc())
        .limit(10)
        .all()
    )
    for u in recent_users:
        logs.append({
            "id": f"act-u-{u.id}",
            "type": "USER_REGISTERED",
            "title": f"New athlete account created: {u.name}",
            "detail": f"Registered with email {u.email} ({u.status} status)",
            "time": u.created_at.strftime("%Y-%m-%d %H:%M UTC") if u.created_at else "Recently",
            "severity": "info",
            "rawTime": u.created_at or datetime.now(timezone.utc),
        })

    # Sort combined feed by rawTime desc
    logs.sort(key=lambda x: x["rawTime"], reverse=True)

    # Clean rawTime before JSON return
    for l in logs:
        del l["rawTime"]

    return logs[:25]