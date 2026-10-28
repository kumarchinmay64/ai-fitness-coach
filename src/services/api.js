import { MOCK_EXERCISES, MOCK_WEEKLY_SCHEDULE } from '../data/mockWorkouts';
import { MOCK_NUTRITION_PROFILE, INITIAL_MEAL_SLOTS, SAMPLE_MEAL_PLAN, DEFAULT_NUTRITION_TARGETS } from '../data/mockNutrition';
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ANALYTICS, MOCK_ACTIVITY_LOGS } from '../data/mockAdminData';

// Backend API root URL
const BACKEND_URL = 'http://127.0.0.1:8000';

// Token keys
const USER_TOKEN_KEY = 'ai_fitness_token';
const ADMIN_TOKEN_KEY = 'ai_fitness_admin_token';

// Simulated latency helper for local operations
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage helpers for client persistence & offline fallback
const getStorage = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // -------------------------------------------------------------
  // AUTHENTICATION ENDPOINTS (REAL FASTAPI + JWT)
  // -------------------------------------------------------------
  auth: {
    async login(email, password) {
      if (!email || !password) {
        throw new Error('Please provide both email and password.');
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Invalid email or password.');
        }

        const data = await response.json();
        localStorage.setItem(USER_TOKEN_KEY, data.access_token);
        setStorage('ai_fitness_user', data.user);
        return data.user;
      } catch (err) {
        // If network request failed to connect to backend, check if it was a real credentials error
        if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
          throw err;
        }

        console.warn('Backend unavailable during login. Falling back to cached session:', err);
        await delay(250);
        const existingUser = getStorage('ai_fitness_user', null);
        if (existingUser) return existingUser;
        throw new Error('Could not connect to authentication server. Please ensure backend is running.');
      }
    },

    async adminLogin(email, password) {
      if (!email || !password) {
        throw new Error('Staff credentials required.');
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/admin-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Access denied: Invalid staff credentials.');
        }

        const data = await response.json();
        localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
        setStorage('ai_fitness_admin', data.admin);
        return data.admin;
      } catch (err) {
        if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
          throw err;
        }
        console.warn('Backend unavailable during admin login:', err);
        throw new Error('Could not connect to authentication server.');
      }
    },

    async signup(userData) {
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required.');
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userData.name || 'Athlete',
            email: userData.email,
            password: userData.password,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed. Email may already be in use.');
        }

        const data = await response.json();
        localStorage.setItem(USER_TOKEN_KEY, data.access_token);
        setStorage('ai_fitness_user', data.user);
        return data.user;
      } catch (err) {
        if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
          throw err;
        }
        console.warn('Backend unavailable during signup:', err);
        throw new Error('Could not connect to registration server. Please ensure backend is running.');
      }
    },

    async getCurrentUser() {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (!token) {
        return getStorage('ai_fitness_user', null);
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem(USER_TOKEN_KEY);
          localStorage.removeItem('ai_fitness_user');
          return null;
        }

        if (response.ok) {
          const data = await response.json();
          setStorage('ai_fitness_user', data.user);
          return data.user;
        }
      } catch (err) {
        console.warn('Backend check failed, using local user cache:', err);
      }

      return getStorage('ai_fitness_user', null);
    },

    async getCurrentAdmin() {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        return getStorage('ai_fitness_admin', null);
      }
      return getStorage('ai_fitness_admin', null);
    },

    async logout() {
      localStorage.removeItem(USER_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('ai_fitness_user');
      localStorage.removeItem('ai_fitness_admin');
      return true;
    }
  },

  // -------------------------------------------------------------
  // ONBOARDING & HEALTH PROFILE (FASTAPI + PERSISTENCE)
  // -------------------------------------------------------------
  onboarding: {
    async saveHealthProfile(profile) {
      setStorage('ai_fitness_health_profile', profile);

      const user = getStorage('ai_fitness_user', {});
      if (user) {
        user.isNewUser = false;
        user.healthProfile = profile;
        setStorage('ai_fitness_user', user);
      }

      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/onboarding/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(profile),
          });

          if (response.ok) {
            const serverProfile = await response.json();
            return serverProfile;
          }
        } catch (err) {
          console.warn('Could not sync health profile to backend database:', err);
        }
      }

      return profile;
    },

    async getHealthProfile() {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/onboarding/profile`, {
            headers: { ...getAuthHeaders() },
          });
          if (response.ok) {
            const serverProfile = await response.json();
            setStorage('ai_fitness_health_profile', serverProfile);
            return serverProfile;
          }
        } catch (err) {
          console.warn('Could not fetch health profile from backend, using local:', err);
        }
      }

      return getStorage('ai_fitness_health_profile', {
        age: 25,
        gender: 'Male',
        heightCm: 178,
        weightKg: 75,
        fitnessLevel: 'Beginner',
        goal: 'Hypertrophy & Posture Correction',
        workoutFrequency: 4,
        equipment: 'Dumbbells & Bodyweight',
        injuries: 'None',
      });
    }
  },

  // -------------------------------------------------------------
  // WORKOUT PLANS & EXERCISES
  // -------------------------------------------------------------
  workouts: {
    async getWeeklySchedule() {
      await delay(200);
      return getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
    },

    async getExercises() {
      await delay(200);
      return getStorage('ai_fitness_exercises', MOCK_EXERCISES);
    },

    async getExerciseById(id) {
      await delay(100);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      return exercises.find((ex) => ex.id === id) || exercises[0];
    },

    async getWorkoutHistory() {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/workouts/history`, {
            headers: { ...getAuthHeaders() },
          });
          if (response.ok) {
            const sessions = await response.json();
            setStorage('ai_fitness_workout_history', sessions);
            return sessions;
          }
        } catch (err) {
          console.warn('Could not fetch workout history from backend:', err);
        }
      }
      return getStorage('ai_fitness_workout_history', []);
    },

    async recordCompletedSession(sessionResult) {
      const history = getStorage('ai_fitness_workout_history', []);
      let entry = {
        ...sessionResult,
        id: 'sess-' + Date.now(),
        date: new Date().toISOString()
      };

      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/workouts/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              exerciseName: sessionResult.exerciseName || 'Squats',
              reps: Number(sessionResult.reps) || 0,
              sets: Number(sessionResult.sets) || 1,
              totalDurationSeconds: Number(sessionResult.totalDurationSeconds) || 0,
              accuracy: Number(sessionResult.accuracy) || 90.0,
              calories: Number(sessionResult.calories) || 0.0,
            }),
          });
          if (response.ok) {
            const dbSession = await response.json();
            entry = dbSession;
          }
        } catch (err) {
          console.warn('Backend unavailable, saving workout locally:', err);
        }
      }

      history.unshift(entry);
      setStorage('ai_fitness_workout_history', history);

      // Update user streak & totals
      const user = getStorage('ai_fitness_user', null);
      if (user) {
        user.totalWorkouts = (user.totalWorkouts || 0) + 1;
        user.streak = (user.streak || 0) + 1;
        user.totalReps = (user.totalReps || 0) + (Number(sessionResult.reps) || 0);
        user.formAccuracyAvg = Math.round(
          history.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / history.length
        );
        setStorage('ai_fitness_user', user);
      }

      // Mark today's schedule slot as completed if matching
      const schedule = getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
      const currentDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
      const daySlot = schedule.find((d) => d.day.toLowerCase() === currentDayName.toLowerCase());
      if (daySlot) {
        daySlot.completed = true;
        setStorage('ai_fitness_weekly_schedule', schedule);
      }

      // Also log activity to admin audit
      const logs = getStorage('ai_fitness_activity_logs', MOCK_ACTIVITY_LOGS);
      logs.unshift({
        id: 'act-' + Date.now(),
        type: 'WORKOUT_COMPLETED',
        title: `${sessionResult.exerciseName || 'Workout'} session completed`,
        detail: `${sessionResult.reps || 0} reps tracked with ${sessionResult.accuracy || 0}% form accuracy score`,
        time: 'Just now',
        severity: 'success'
      });
      setStorage('ai_fitness_activity_logs', logs);

      return entry;
    },

    async addExerciseSlotToDay(dayName, exerciseData) {
      await delay(250);
      const schedule = getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
      const dayObj = schedule.find((d) => d.day.toLowerCase() === dayName.toLowerCase());
      if (dayObj) {
        dayObj.exercises.push({
          exerciseId: exerciseData.exerciseId || 'ex-1',
          sets: exerciseData.sets || 3,
          reps: exerciseData.reps || 10,
          completedSets: 0,
          note: exerciseData.note || 'User-added custom exercise slot',
          isCustom: true
        });
        setStorage('ai_fitness_weekly_schedule', schedule);
      }
      return schedule;
    },

    async regeneratePlan(preferences) {
      await delay(500);
      const updated = MOCK_WEEKLY_SCHEDULE.map((day) => ({
        ...day,
        duration: preferences.duration || day.duration,
        focus: preferences.focus || day.focus,
        completed: false
      }));
      setStorage('ai_fitness_weekly_schedule', updated);
      return updated;
    }
  },

  // -------------------------------------------------------------
  // NUTRITION & MEAL TRACKING (FASTAPI + PERSISTENCE)
  // -------------------------------------------------------------
  nutrition: {
    async getProfile(date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const dateParam = date ? `?date=${encodeURIComponent(date)}` : '';
          const response = await fetch(`${BACKEND_URL}/api/nutrition/profile${dateParam}`, {
            headers: { ...getAuthHeaders() },
          });
          if (response.ok) {
            const data = await response.json();
            setStorage('ai_fitness_nutrition', data);
            return data;
          }
        } catch (err) {
          console.warn('Backend unavailable, using cached nutrition profile:', err);
        }
      }
      return getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
    },

    async updateWater(newGlassCount, date) {
      const safeGlasses = Math.max(0, Number(newGlassCount) || 0);
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/water`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              glasses: safeGlasses,
              date: date || undefined,
            }),
          });
          if (response.ok) {
            const result = await response.json();
            const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
            if (current && current.currentConsumed) {
              current.currentConsumed.waterGlasses = result.waterGlasses;
              setStorage('ai_fitness_nutrition', current);
            }
            return result.waterGlasses;
          }
        } catch (err) {
          console.warn('Backend unavailable, saving water locally:', err);
        }
      }

      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      if (current && current.currentConsumed) {
        current.currentConsumed.waterGlasses = safeGlasses;
        setStorage('ai_fitness_nutrition', current);
      }
      return safeGlasses;
    },

    async fillMealSlot(slotId, mealData, date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/meal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              slotId: slotId,
              category: mealData.category || 'Custom',
              name: mealData.name,
              calories: Number(mealData.calories) || 0,
              protein: Number(mealData.protein) || 0,
              carbs: Number(mealData.carbs) || 0,
              fat: Number(mealData.fat) || 0,
              prepTime: mealData.prepTime || '10 mins',
              instructions: mealData.instructions || null,
              imageNote: mealData.imageNote || null,
              date: date || undefined,
            }),
          });
          if (response.ok) {
            const updatedProfile = await response.json();
            setStorage('ai_fitness_nutrition', updatedProfile);
            return updatedProfile;
          }
        } catch (err) {
          console.warn('Backend unavailable, saving meal locally:', err);
        }
      }

      await delay(250);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      const targetSlot = current.meals.find((m) => m.id === slotId);
      if (targetSlot) {
        targetSlot.name = mealData.name || targetSlot.category;
        targetSlot.calories = Number(mealData.calories) || 0;
        targetSlot.protein = Number(mealData.protein) || 0;
        targetSlot.carbs = Number(mealData.carbs) || 0;
        targetSlot.fat = Number(mealData.fat) || 0;
        targetSlot.prepTime = mealData.prepTime || '10 mins';
        targetSlot.completed = true;
        targetSlot.isSlotOpen = false;
        targetSlot.instructions = mealData.instructions || 'Custom logged meal.';
        targetSlot.imageNote = mealData.imageNote || 'Logged by user.';
      } else {
        current.meals.push({
          id: 'meal-' + Date.now(),
          category: mealData.category || 'Custom Meal',
          slotTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: mealData.name,
          calories: Number(mealData.calories) || 0,
          protein: Number(mealData.protein) || 0,
          carbs: Number(mealData.carbs) || 0,
          fat: Number(mealData.fat) || 0,
          prepTime: '5 mins',
          completed: true,
          isSlotOpen: false,
          instructions: 'Custom logged meal.'
        });
      }

      current.currentConsumed.calories = current.meals.reduce((sum, m) => sum + (m.completed ? m.calories : 0), 0);
      current.currentConsumed.proteinGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.protein : 0), 0);
      current.currentConsumed.carbsGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.carbs : 0), 0);
      current.currentConsumed.fatGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.fat : 0), 0);

      setStorage('ai_fitness_nutrition', current);
      return current;
    },

    async loadSamplePlan(date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/sample-plan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ date: date || undefined }),
          });
          if (response.ok) {
            const updatedProfile = await response.json();
            setStorage('ai_fitness_nutrition', updatedProfile);
            return updatedProfile;
          }
        } catch (err) {
          console.warn('Backend unavailable, loading sample plan locally:', err);
        }
      }

      await delay(300);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.meals = JSON.parse(JSON.stringify(SAMPLE_MEAL_PLAN));
      current.currentConsumed = {
        calories: current.meals.reduce((sum, m) => sum + m.calories, 0),
        proteinGrams: current.meals.reduce((sum, m) => sum + m.protein, 0),
        carbsGrams: current.meals.reduce((sum, m) => sum + m.carbs, 0),
        fatGrams: current.meals.reduce((sum, m) => sum + m.fat, 0),
        waterGlasses: 4,
        targetGlasses: 10
      };
      setStorage('ai_fitness_nutrition', current);
      return current;
    },

    async resetMealSlots(date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/reset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({ date: date || undefined }),
          });
          if (response.ok) {
            const resetProfile = await response.json();
            setStorage('ai_fitness_nutrition', resetProfile);
            return resetProfile;
          }
        } catch (err) {
          console.warn('Backend unavailable, resetting meal slots locally:', err);
        }
      }

      await delay(200);
      const resetProfile = {
        dailyTargets: DEFAULT_NUTRITION_TARGETS,
        currentConsumed: {
          calories: 0,
          proteinGrams: 0,
          carbsGrams: 0,
          fatGrams: 0,
          waterGlasses: 0,
          targetGlasses: 10,
        },
        dietPreference: 'High Protein',
        activeDietOptions: ['High Protein', 'Balanced', 'Keto', 'Plant-Based / Vegan', 'Paleo'],
        meals: JSON.parse(JSON.stringify(INITIAL_MEAL_SLOTS)),
      };
      setStorage('ai_fitness_nutrition', resetProfile);
      return resetProfile;
    },

    async updateDailyTargets(newTargets, date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/targets`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              calories: Number(newTargets.calories),
              proteinGrams: Number(newTargets.proteinGrams),
              carbsGrams: Number(newTargets.carbsGrams),
              fatGrams: Number(newTargets.fatGrams),
              targetGlasses: Number(newTargets.targetGlasses || 10),
              date: date || undefined,
            }),
          });
          if (response.ok) {
            const updatedProfile = await response.json();
            setStorage('ai_fitness_nutrition', updatedProfile);
            return updatedProfile.dailyTargets;
          }
        } catch (err) {
          console.warn('Backend unavailable, saving targets locally:', err);
        }
      }

      await delay(200);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.dailyTargets = { ...current.dailyTargets, ...newTargets };
      setStorage('ai_fitness_nutrition', current);
      return current.dailyTargets;
    },

    async updateDietPreference(diet, date) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/diet-preference`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              dietPreference: diet,
              date: date || undefined,
            }),
          });
          if (response.ok) {
            const res = await response.json();
            const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
            current.dietPreference = res.dietPreference;
            setStorage('ai_fitness_nutrition', current);
            return res.dietPreference;
          }
        } catch (err) {
          console.warn('Backend unavailable, saving diet preference locally:', err);
        }
      }

      await delay(150);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.dietPreference = diet;
      setStorage('ai_fitness_nutrition', current);
      return diet;
    },

    async deleteMeal(mealId) {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/nutrition/meal/${mealId}`, {
            method: 'DELETE',
            headers: { ...getAuthHeaders() },
          });
          if (response.ok) {
            const updatedProfile = await response.json();
            setStorage('ai_fitness_nutrition', updatedProfile);
            return updatedProfile;
          }
        } catch (err) {
          console.warn('Backend unavailable, deleting meal locally:', err);
        }
      }
    }
  },

  // -------------------------------------------------------------
  // PROGRESS & ANALYTICS
  // -------------------------------------------------------------
  analytics: {
    async getUserAnalytics() {
      const token = localStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/analytics/user`, {
            headers: { ...getAuthHeaders() },
          });
          if (response.ok) {
            return await response.json();
          }
        } catch (err) {
          console.warn('Backend analytics unavailable, calculating locally:', err);
        }
      }

      await delay(150);
      const history = getStorage('ai_fitness_workout_history', []);
      const totalWorkouts = history.length;
      const totalRepsLogged = history.reduce((sum, h) => sum + (Number(h.reps) || 0), 0);
      const averageAccuracy = totalWorkouts > 0 
        ? Math.round(history.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / totalWorkouts) 
        : null;
      const caloriesBurnedWeek = history.reduce((sum, h) => sum + (Number(h.calories) || 0), 0);
      const streakDays = totalWorkouts > 0 ? Math.min(totalWorkouts, 7) : 0;

      // Real trend from actual recorded sessions
      const formAccuracyTrend = history.slice(0, 7).reverse().map((h, i) => ({
        day: `Session ${i + 1}`,
        score: h.accuracy || 90
      }));

      // Rep distribution from real sessions
      const repMap = {};
      history.forEach((h) => {
        const name = h.exerciseName || 'Squats';
        repMap[name] = (repMap[name] || 0) + (Number(h.reps) || 0);
      });
      const repDistribution = Object.keys(repMap).map((k) => ({
        exercise: k,
        reps: repMap[k]
      }));

      return {
        streakDays,
        totalWorkouts,
        totalRepsLogged,
        averageAccuracy,
        caloriesBurnedWeek,
        hasData: totalWorkouts > 0,
        weeklyFrequency: [
          { week: 'Wk 1', sessions: Math.min(totalWorkouts, 3), target: 4 },
          { week: 'Wk 2', sessions: 0, target: 4 },
          { week: 'Wk 3', sessions: 0, target: 4 },
          { week: 'Wk 4', sessions: 0, target: 4 },
        ],
        repDistribution,
        formAccuracyTrend,
        weightTrend: [
          { week: 'Start', weight: 75.0 },
          { week: 'Current', weight: 75.0 }
        ]
      };
    },

    async getBenchmarks() {
      await delay(150);
      const defaultBenchmarks = [
        { id: 'bm-squat', name: 'Barbell Deep Squat', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 100 kg' },
        { id: 'bm-pushup', name: 'Standard Push-Ups', metric: 'Max Consecutive Reps', value: null, isSlotOpen: true, placeholder: 'e.g. 25 reps' },
        { id: 'bm-deadlift', name: 'Romanian Deadlift', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 120 kg' },
        { id: 'bm-plank', name: 'Isometric Plank', metric: 'Max Hold Time (seconds)', value: null, isSlotOpen: true, placeholder: 'e.g. 90 sec' }
      ];
      return getStorage('ai_fitness_benchmarks', defaultBenchmarks);
    },

    async updateBenchmark(id, value) {
      await delay(200);
      const defaultBenchmarks = [
        { id: 'bm-squat', name: 'Barbell Deep Squat', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 100 kg' },
        { id: 'bm-pushup', name: 'Standard Push-Ups', metric: 'Max Consecutive Reps', value: null, isSlotOpen: true, placeholder: 'e.g. 25 reps' },
        { id: 'bm-deadlift', name: 'Romanian Deadlift', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 120 kg' },
        { id: 'bm-plank', name: 'Isometric Plank', metric: 'Max Hold Time (seconds)', value: null, isSlotOpen: true, placeholder: 'e.g. 90 sec' }
      ];
      const benchmarks = getStorage('ai_fitness_benchmarks', defaultBenchmarks);
      const target = benchmarks.find((b) => b.id === id);
      if (target) {
        target.value = value;
        target.isSlotOpen = false;
        target.updatedAt = new Date().toLocaleDateString();
        setStorage('ai_fitness_benchmarks', benchmarks);
      }
      return benchmarks;
    }
  },

  // -------------------------------------------------------------
  // ADMIN PLATFORM MANAGEMENT
  // -------------------------------------------------------------
  admin: {
    async getUsers(search = '', status = 'All') {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const params = new URLSearchParams();
          if (search) params.append('search', search);
          if (status && status !== 'All') params.append('status', status);
          const query = params.toString() ? `?${params.toString()}` : '';

          const response = await fetch(`${BACKEND_URL}/api/admin/users${query}`, {
            headers: { ...getAdminAuthHeaders() },
          });
          if (response.ok) {
            const users = await response.json();
            setStorage('ai_fitness_admin_users', users);
            return users;
          }
        } catch (err) {
          console.warn('Backend unavailable, using cached admin users:', err);
        }
      }

      await delay(250);
      const adminUsers = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const currentUser = getStorage('ai_fitness_user', null);
      if (currentUser && !adminUsers.some((u) => u.email === currentUser.email)) {
        return [
          {
            id: currentUser.id || 'usr-local',
            name: currentUser.name || 'Current User',
            email: currentUser.email || 'user@example.com',
            role: 'user',
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
            workoutsCompleted: currentUser.totalWorkouts || 0,
            avgAccuracy: currentUser.formAccuracyAvg || null,
            goal: currentUser.healthProfile?.goal || 'General Fitness',
            tier: 'Athlete Free'
          },
          ...adminUsers
        ];
      }
      return adminUsers;
    },

    async addAthleteSlot(athleteData) {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/athletes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAdminAuthHeaders(),
            },
            body: JSON.stringify({
              name: athleteData.name || 'New Athlete',
              email: athleteData.email,
              goal: athleteData.goal || 'Hypertrophy & Posture Correction',
            }),
          });
          if (response.ok) {
            const created = await response.json();
            const currentList = getStorage('ai_fitness_admin_users', []);
            setStorage('ai_fitness_admin_users', [created, ...currentList]);
            return created;
          }
        } catch (err) {
          console.warn('Backend unavailable, adding athlete locally:', err);
        }
      }

      await delay(300);
      const users = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const newAthlete = {
        id: 'usr-' + Date.now(),
        name: athleteData.name || 'New Athlete Slot',
        email: athleteData.email || `athlete-${Date.now()}@pulseai.com`,
        role: 'user',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        workoutsCompleted: 0,
        avgAccuracy: null,
        goal: athleteData.goal || 'Hypertrophy & Posture',
        tier: 'Athlete Free'
      };
      users.unshift(newAthlete);
      setStorage('ai_fitness_admin_users', users);
      return newAthlete;
    },

    async toggleUserStatus(userId) {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAdminAuthHeaders(),
            },
          });
          if (response.ok) {
            const updatedUser = await response.json();
            // Fetch fresh list from server
            const freshUsersRes = await fetch(`${BACKEND_URL}/api/admin/users`, {
              headers: { ...getAdminAuthHeaders() },
            });
            if (freshUsersRes.ok) {
              const freshUsers = await freshUsersRes.json();
              setStorage('ai_fitness_admin_users', freshUsers);
              return freshUsers;
            }
          } else {
            const errJson = await response.json().catch(() => ({}));
            throw new Error(errJson.detail || 'Failed to toggle status');
          }
        } catch (err) {
          console.warn('Backend unavailable or failed to toggle status:', err);
          throw err;
        }
      }

      await delay(200);
      const users = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const target = users.find((u) => u.id === userId);
      if (target) {
        target.status = target.status === 'Active' ? 'Suspended' : 'Active';
        setStorage('ai_fitness_admin_users', users);
      }
      return users;
    },

    async getSystemAnalytics() {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/analytics`, {
            headers: { ...getAdminAuthHeaders() },
          });
          if (response.ok) {
            return await response.json();
          }
        } catch (err) {
          console.warn('Backend unavailable, using mock admin analytics:', err);
        }
      }

      await delay(250);
      return MOCK_ADMIN_ANALYTICS;
    },

    async getActivityLogs() {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/admin/activity`, {
            headers: { ...getAdminAuthHeaders() },
          });
          if (response.ok) {
            const logs = await response.json();
            setStorage('ai_fitness_activity_logs', logs);
            return logs;
          }
        } catch (err) {
          console.warn('Backend unavailable, using mock activity logs:', err);
        }
      }

      await delay(200);
      return getStorage('ai_fitness_activity_logs', MOCK_ACTIVITY_LOGS);
    },

    async addExercise(exerciseData) {
      await delay(300);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const newEx = {
        ...exerciseData,
        id: 'ex-' + Date.now(),
        defaultSets: Number(exerciseData.defaultSets) || 3,
        defaultReps: Number(exerciseData.defaultReps) || 10,
        formCues: exerciseData.formCues || ['Maintain neutral spine and controlled descent.'],
        commonMistakes: exerciseData.commonMistakes || ['Moving too quickly through eccentric phase.']
      };
      exercises.unshift(newEx);
      setStorage('ai_fitness_exercises', exercises);
      return newEx;
    },

    async updateExercise(id, exerciseData) {
      await delay(250);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const index = exercises.findIndex((ex) => ex.id === id);
      if (index !== -1) {
        exercises[index] = { ...exercises[index], ...exerciseData };
        setStorage('ai_fitness_exercises', exercises);
        return exercises[index];
      }
      throw new Error('Exercise not found');
    },

    async deleteExercise(id) {
      await delay(200);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const filtered = exercises.filter((ex) => ex.id !== id);
      setStorage('ai_fitness_exercises', filtered);
      return filtered;
    }
  }
};
