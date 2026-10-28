import os
import unittest
from datetime import datetime, timezone
from fastapi.testclient import TestClient

from main import app
import models
from database import get_db

client = TestClient(app)


class TestNutritionDatabase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create User A
        ts = int(datetime.now().timestamp() * 1000)
        cls.email_a = f"nutri_user_a_{ts}@test.com"
        cls.email_b = f"nutri_user_b_{ts}@test.com"
        cls.password = "StrongPassword123!"

        res_a = client.post(
            "/api/auth/signup",
            json={"name": "Nutri Athlete A", "email": cls.email_a, "password": cls.password},
        )
        assert res_a.status_code == 200, f"Signup A failed: {res_a.text}"
        data_a = res_a.json()
        cls.token_a = data_a["access_token"]
        cls.headers_a = {"Authorization": f"Bearer {cls.token_a}"}

        res_b = client.post(
            "/api/auth/signup",
            json={"name": "Nutri Athlete B", "email": cls.email_b, "password": cls.password},
        )
        assert res_b.status_code == 200, f"Signup B failed: {res_b.text}"
        data_b = res_b.json()
        cls.token_b = data_b["access_token"]
        cls.headers_b = {"Authorization": f"Bearer {cls.token_b}"}

    def test_01_unauthenticated_requests_rejected(self):
        """Unauthenticated requests must return 401 Unauthorized."""
        res_prof = client.get("/api/nutrition/profile")
        self.assertEqual(res_prof.status_code, 401)

        res_meal = client.post("/api/nutrition/meal", json={"name": "Toast", "calories": 150})
        self.assertEqual(res_meal.status_code, 401)

        res_water = client.post("/api/nutrition/water", json={"glasses": 2})
        self.assertEqual(res_water.status_code, 401)

        res_targets = client.post(
            "/api/nutrition/targets",
            json={"calories": 2000, "proteinGrams": 150, "carbsGrams": 200, "fatGrams": 60},
        )
        self.assertEqual(res_targets.status_code, 401)

    def test_02_get_default_daily_nutrition_profile(self):
        """New user profile has 0 consumed calories, default targets, and 4 open slots."""
        res = client.get("/api/nutrition/profile", headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertIn("dailyTargets", data)
        self.assertIn("currentConsumed", data)
        self.assertIn("meals", data)
        self.assertEqual(data["currentConsumed"]["calories"], 0)
        self.assertEqual(data["currentConsumed"]["proteinGrams"], 0)
        self.assertEqual(data["currentConsumed"]["waterGlasses"], 0)
        self.assertEqual(len(data["meals"]), 4)
        self.assertTrue(all(not m["completed"] for m in data["meals"]))
        self.assertTrue(all(m["isSlotOpen"] for m in data["meals"]))

    def test_03_record_and_update_standard_meal_slot(self):
        """Record a breakfast meal, check totals, then update and check updated totals."""
        payload = {
            "slotId": "slot-breakfast",
            "category": "Breakfast",
            "name": "Power Oats with Whey",
            "calories": 480.0,
            "protein": 38.0,
            "carbs": 58.0,
            "fat": 10.0,
            "prepTime": "10 mins",
        }
        res = client.post("/api/nutrition/meal", json=payload, headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["currentConsumed"]["calories"], 480)
        self.assertEqual(data["currentConsumed"]["proteinGrams"], 38)
        self.assertEqual(data["currentConsumed"]["carbsGrams"], 58)
        self.assertEqual(data["currentConsumed"]["fatGrams"], 10)

        breakfast_slot = next(m for m in data["meals"] if m["id"] == "slot-breakfast")
        self.assertTrue(breakfast_slot["completed"])
        self.assertFalse(breakfast_slot["isSlotOpen"])
        self.assertEqual(breakfast_slot["name"], "Power Oats with Whey")

        # Now update the same slot with modified macros
        update_payload = {
            "slotId": "slot-breakfast",
            "category": "Breakfast",
            "name": "Power Oats with Whey + Banana",
            "calories": 580.0,
            "protein": 40.0,
            "carbs": 82.0,
            "fat": 11.0,
            "prepTime": "12 mins",
        }
        res2 = client.post("/api/nutrition/meal", json=update_payload, headers=self.headers_a)
        self.assertEqual(res2.status_code, 200)
        data2 = res2.json()

        self.assertEqual(data2["currentConsumed"]["calories"], 580)
        self.assertEqual(data2["currentConsumed"]["proteinGrams"], 40)
        self.assertEqual(data2["currentConsumed"]["carbsGrams"], 82)
        self.assertEqual(data2["currentConsumed"]["fatGrams"], 11)

    def test_04_record_custom_meal_and_delete(self):
        """Log a custom meal, verify it appends to meals, then delete it."""
        custom_payload = {
            "slotId": "custom-snack-1",
            "category": "Snacks",
            "name": "Protein Bar",
            "calories": 220.0,
            "protein": 20.0,
            "carbs": 24.0,
            "fat": 7.0,
        }
        res = client.post("/api/nutrition/meal", json=custom_payload, headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Should now have 5 items in meals (4 standard + 1 custom)
        self.assertEqual(len(data["meals"]), 5)
        custom_slot = next(m for m in data["meals"] if m["name"] == "Protein Bar")
        numeric_id = custom_slot["numericId"]

        # Delete the custom meal
        del_res = client.delete(f"/api/nutrition/meal/{numeric_id}", headers=self.headers_a)
        self.assertEqual(del_res.status_code, 200)
        del_data = del_res.json()
        self.assertEqual(len(del_data["meals"]), 4)

    def test_05_update_and_persist_water_intake(self):
        """Update water glasses and ensure persistence."""
        res = client.post("/api/nutrition/water", json={"glasses": 6}, headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["waterGlasses"], 6)

        # Check in profile
        prof = client.get("/api/nutrition/profile", headers=self.headers_a).json()
        self.assertEqual(prof["currentConsumed"]["waterGlasses"], 6)

    def test_06_update_daily_targets_and_diet_preference(self):
        """Configure custom targets and diet preference."""
        target_payload = {
            "calories": 2600,
            "proteinGrams": 190,
            "carbsGrams": 270,
            "fatGrams": 75,
            "targetGlasses": 12,
        }
        res_tar = client.post("/api/nutrition/targets", json=target_payload, headers=self.headers_a)
        self.assertEqual(res_tar.status_code, 200)
        data_tar = res_tar.json()
        self.assertEqual(data_tar["dailyTargets"]["calories"], 2600)
        self.assertEqual(data_tar["dailyTargets"]["proteinGrams"], 190)
        self.assertEqual(data_tar["dailyTargets"]["targetGlasses"], 12)

        res_diet = client.post(
            "/api/nutrition/diet-preference",
            json={"dietPreference": "Keto"},
            headers=self.headers_a,
        )
        self.assertEqual(res_diet.status_code, 200)
        self.assertEqual(res_diet.json()["dietPreference"], "Keto")

    def test_07_load_sample_plan_and_reset_slots(self):
        """Load sample balanced template (4 meals, 4 glasses) then reset."""
        res_sample = client.post("/api/nutrition/sample-plan", json={}, headers=self.headers_a)
        self.assertEqual(res_sample.status_code, 200)
        data_sample = res_sample.json()

        # All 4 standard slots are now completed
        self.assertEqual(len(data_sample["meals"]), 4)
        self.assertTrue(all(m["completed"] for m in data_sample["meals"]))
        self.assertEqual(data_sample["currentConsumed"]["waterGlasses"], 4)
        expected_calories = 480 + 620 + 280 + 580  # 1960
        self.assertEqual(data_sample["currentConsumed"]["calories"], expected_calories)

        # Reset slots
        res_reset = client.post("/api/nutrition/reset", json={}, headers=self.headers_a)
        self.assertEqual(res_reset.status_code, 200)
        data_reset = res_reset.json()
        self.assertEqual(data_reset["currentConsumed"]["calories"], 0)
        self.assertEqual(data_reset["currentConsumed"]["waterGlasses"], 0)
        self.assertTrue(all(not m["completed"] for m in data_reset["meals"]))

    def test_08_cross_user_isolation(self):
        """User A data cannot be accessed, modified, or leaked to User B."""
        # User A logs a distinct meal
        meal_res = client.post(
            "/api/nutrition/meal",
            json={
                "slotId": "slot-lunch",
                "category": "Lunch",
                "name": "User A Private Salmon Bowl",
                "calories": 750,
                "protein": 55,
                "carbs": 60,
                "fat": 25,
            },
            headers=self.headers_a,
        )
        self.assertEqual(meal_res.status_code, 200)
        meal_a_id = next(m["numericId"] for m in meal_res.json()["meals"] if m["id"] == "slot-lunch")

        # Set User A water
        client.post("/api/nutrition/water", json={"glasses": 8}, headers=self.headers_a)

        # User B queries their profile
        prof_b = client.get("/api/nutrition/profile", headers=self.headers_b).json()
        self.assertEqual(prof_b["currentConsumed"]["calories"], 0)
        self.assertEqual(prof_b["currentConsumed"]["waterGlasses"], 0)
        self.assertFalse(any("Private Salmon" in m["name"] for m in prof_b["meals"]))

        # User B attempts to delete User A's meal
        del_attempt = client.delete(f"/api/nutrition/meal/{meal_a_id}", headers=self.headers_b)
        self.assertEqual(del_attempt.status_code, 404)

        # User A's meal is still intact
        prof_a = client.get("/api/nutrition/profile", headers=self.headers_a).json()
        lunch_a = next(m for m in prof_a["meals"] if m["id"] == "slot-lunch")
        self.assertEqual(lunch_a["name"], "User A Private Salmon Bowl")

    def test_09_invalid_input_and_dates_rejected(self):
        """Invalid date strings, negative nutrients, and out-of-range values return 400."""
        # Invalid date format
        res_bad_date = client.get("/api/nutrition/daily?date=2026/10/23", headers=self.headers_a)
        self.assertEqual(res_bad_date.status_code, 400)

        res_bad_date2 = client.get("/api/nutrition/daily?date=invalid-date", headers=self.headers_a)
        self.assertEqual(res_bad_date2.status_code, 400)

        # Empty meal name
        res_empty_name = client.post(
            "/api/nutrition/meal",
            json={"name": "   ", "calories": 200},
            headers=self.headers_a,
        )
        self.assertEqual(res_empty_name.status_code, 400)

        # Negative calories
        res_neg_cal = client.post(
            "/api/nutrition/meal",
            json={"name": "Salad", "calories": -50},
            headers=self.headers_a,
        )
        self.assertEqual(res_neg_cal.status_code, 400)

        # Negative water
        res_neg_water = client.post(
            "/api/nutrition/water",
            json={"glasses": -3},
            headers=self.headers_a,
        )
        self.assertEqual(res_neg_water.status_code, 400)

        # Excessive water (> 50)
        res_huge_water = client.post(
            "/api/nutrition/water",
            json={"glasses": 99},
            headers=self.headers_a,
        )
        self.assertEqual(res_huge_water.status_code, 400)

        # Zero or negative targets
        res_bad_target = client.post(
            "/api/nutrition/targets",
            json={"calories": -100, "proteinGrams": 0, "carbsGrams": 100, "fatGrams": 50},
            headers=self.headers_a,
        )
        self.assertEqual(res_bad_target.status_code, 400)

        # Invalid diet preference
        res_bad_diet = client.post(
            "/api/nutrition/diet-preference",
            json={"dietPreference": "JunkFoodDiet"},
            headers=self.headers_a,
        )
        self.assertEqual(res_bad_diet.status_code, 400)

    def test_10_existing_functionality_intact(self):
        """Health profile, workouts, and auth continue to function cleanly."""
        prof_res = client.post(
            "/api/onboarding/profile",
            json={"age": 28, "heightCm": 182.0, "weightKg": 80.0, "goal": "Strength"},
            headers=self.headers_a,
        )
        self.assertEqual(prof_res.status_code, 200)

        workout_res = client.post(
            "/api/workouts/session",
            json={"exerciseName": "Barbell Squats", "reps": 12, "accuracy": 94.0},
            headers=self.headers_a,
        )
        self.assertEqual(workout_res.status_code, 200)

        anal_res = client.get("/api/analytics/user", headers=self.headers_a)
        self.assertEqual(anal_res.status_code, 200)
        self.assertEqual(anal_res.json()["totalWorkouts"], 1)


if __name__ == "__main__":
    unittest.main()
