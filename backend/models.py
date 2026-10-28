from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base

def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)  # 'user' or 'admin'
    avatar = Column(
        String(255),
        default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    )
    status = Column(String(20), default="Active")  # 'Active', 'Suspended'
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    health_profile = relationship("HealthProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    workouts = relationship("WorkoutSession", back_populates="user", cascade="all, delete-orphan")
    meals = relationship("MealLog", back_populates="user", cascade="all, delete-orphan")
    daily_nutrition = relationship("DailyNutrition", back_populates="user", cascade="all, delete-orphan")
    benchmarks = relationship("Benchmark", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        total_workouts = len(self.workouts) if self.workouts else 0
        total_reps = sum(w.reps for w in self.workouts) if self.workouts else 0
        avg_acc = (
            round(sum(w.accuracy for w in self.workouts) / total_workouts)
            if total_workouts > 0
            else None
        )
        return {
            "id": f"usr-{self.id}",
            "numeric_id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "avatar": self.avatar,
            "status": self.status,
            "streak": min(total_workouts, 7) if total_workouts > 0 else 0,
            "totalWorkouts": total_workouts,
            "totalReps": total_reps,
            "formAccuracyAvg": avg_acc,
            "isNewUser": total_workouts == 0 and not self.health_profile,
            "healthProfile": self.health_profile.to_dict() if self.health_profile else None,
        }

    def to_admin_dict(self):
        total_workouts = len(self.workouts) if self.workouts else 0
        avg_acc = (
            round(sum(w.accuracy for w in self.workouts) / total_workouts, 1)
            if total_workouts > 0
            else None
        )
        goal = self.health_profile.goal if self.health_profile else "General Fitness"
        joined_date = self.created_at.strftime("%Y-%m-%d") if self.created_at else "2025-01-01"
        return {
            "id": f"usr-{self.id}",
            "numericId": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "joinedDate": joined_date,
            "workoutsCompleted": total_workouts,
            "avgAccuracy": avg_acc,
            "goal": goal,
            "tier": "Administrator" if self.role == "admin" else "Athlete Free",
        }


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(Integer, default=25)
    gender = Column(String(20), default="Male")
    height_cm = Column(Float, default=178.0)
    weight_kg = Column(Float, default=75.0)
    fitness_level = Column(String(50), default="Beginner")
    goal = Column(String(100), default="Hypertrophy & Posture Correction")
    workout_frequency = Column(Integer, default=4)
    equipment = Column(String(100), default="Dumbbells & Bodyweight")
    injuries = Column(String(200), default="None")
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="health_profile")

    def to_dict(self):
        return {
            "age": self.age,
            "gender": self.gender,
            "heightCm": self.height_cm,
            "weightKg": self.weight_kg,
            "fitnessLevel": self.fitness_level,
            "goal": self.goal,
            "workoutFrequency": self.workout_frequency,
            "equipment": self.equipment,
            "injuries": self.injuries,
        }


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    exercise_name = Column(String(100), nullable=False)
    reps = Column(Integer, default=0)
    sets = Column(Integer, default=1)
    duration_seconds = Column(Integer, default=0)
    accuracy = Column(Float, default=90.0)
    calories = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="workouts")

    def to_dict(self):
        return {
            "id": f"sess-{self.id}",
            "exerciseName": self.exercise_name,
            "reps": self.reps,
            "repsCompleted": self.reps,
            "sets": self.sets,
            "setsCompleted": self.sets,
            "totalDurationSeconds": self.duration_seconds,
            "accuracy": self.accuracy,
            "avgFormScore": self.accuracy,
            "calories": self.calories,
            "date": self.created_at.isoformat(),
        }


class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    slot_id = Column(String(50), nullable=True)  # e.g. 'slot-breakfast', 'slot-lunch', 'custom'
    category = Column(String(50), nullable=False)  # 'Breakfast', 'Lunch', 'Dinner', 'Afternoon Fuel', 'Snacks', 'Custom'
    name = Column(String(100), nullable=False)
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    prep_time = Column(String(50), default="10 mins")
    instructions = Column(Text, nullable=True)
    image_note = Column(String(255), nullable=True)
    date = Column(String(10), nullable=False, index=True)  # 'YYYY-MM-DD'
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="meals")

    def to_dict(self):
        return {
            "id": self.slot_id or f"meal-{self.id}",
            "numericId": self.id,
            "slotId": self.slot_id,
            "category": self.category,
            "name": self.name,
            "calories": self.calories,
            "protein": self.protein,
            "carbs": self.carbs,
            "fat": self.fat,
            "prepTime": self.prep_time or "10 mins",
            "instructions": self.instructions or "",
            "imageNote": self.image_note or "Logged by user.",
            "completed": True,
            "isSlotOpen": False,
            "date": self.date,
        }


class DailyNutrition(Base):
    __tablename__ = "daily_nutrition"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    date = Column(String(10), nullable=False, index=True)  # 'YYYY-MM-DD'
    water_glasses = Column(Integer, default=0)
    target_glasses = Column(Integer, default=10)
    target_calories = Column(Float, default=2200.0)
    target_protein = Column(Float, default=160.0)
    target_carbs = Column(Float, default=220.0)
    target_fat = Column(Float, default=65.0)
    diet_preference = Column(String(50), default="High Protein")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="daily_nutrition")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "waterGlasses": self.water_glasses,
            "targetGlasses": self.target_glasses,
            "dailyTargets": {
                "calories": round(self.target_calories),
                "proteinGrams": round(self.target_protein),
                "carbsGrams": round(self.target_carbs),
                "fatGrams": round(self.target_fat),
                "waterLiters": round(self.target_glasses * 0.25, 1),
                "targetGlasses": self.target_glasses,
            },
            "dietPreference": self.diet_preference,
        }


class Benchmark(Base):
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    benchmark_id = Column(String(50), nullable=False)  # e.g. 'bm-squat'
    name = Column(String(100), nullable=False)
    metric = Column(String(100), nullable=False)
    value = Column(String(50), nullable=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="benchmarks")

    def to_dict(self):
        return {
            "id": self.benchmark_id,
            "name": self.name,
            "metric": self.metric,
            "value": self.value,
            "isSlotOpen": self.value is None,
            "updatedAt": self.updated_at.strftime("%Y-%m-%d") if self.updated_at else None,
        }
