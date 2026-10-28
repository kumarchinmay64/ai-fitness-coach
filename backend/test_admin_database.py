import os
import unittest
from datetime import datetime, timezone
from fastapi.testclient import TestClient

from main import app
import models
from database import get_db

client = TestClient(app)


class TestAdminDatabase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # 1. Login as default seeded platform admin
        admin_login_res = client.post(
            "/api/auth/admin-login",
            json={"email": "admin@pulseai.com", "password": "PulseAdmin2025!"},
        )
        assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
        data_admin = admin_login_res.json()
        cls.admin_token = data_admin["access_token"]
        cls.admin_headers = {"Authorization": f"Bearer {cls.admin_token}"}
        cls.admin_user_id = data_admin["admin"]["id"]

        # 2. Create a standard athlete user
        ts = int(datetime.now().timestamp() * 1000)
        cls.athlete_email = f"athlete_for_admin_test_{ts}@pulseai.com"
        cls.athlete_pass = "AthleteSecret2025!"
        reg_res = client.post(
            "/api/auth/signup",
            json={"name": "Audited Athlete", "email": cls.athlete_email, "password": cls.athlete_pass},
        )
        assert reg_res.status_code == 200, f"Signup failed: {reg_res.text}"
        data_ath = reg_res.json()
        cls.athlete_token = data_ath["access_token"]
        cls.athlete_headers = {"Authorization": f"Bearer {cls.athlete_token}"}
        cls.athlete_id = data_ath["user"]["id"]

    def test_01_unauthenticated_requests_rejected(self):
        """Unauthenticated requests to admin endpoints return 401."""
        res_users = client.get("/api/admin/users")
        self.assertEqual(res_users.status_code, 401)

        res_analytics = client.get("/api/admin/analytics")
        self.assertEqual(res_analytics.status_code, 401)

        res_activity = client.get("/api/admin/activity")
        self.assertEqual(res_activity.status_code, 401)

    def test_02_regular_athlete_forbidden_from_admin_endpoints(self):
        """Standard athlete token receives 403 Forbidden on admin routes."""
        res_users = client.get("/api/admin/users", headers=self.athlete_headers)
        self.assertEqual(res_users.status_code, 403)
        self.assertIn("Administrator privileges required", res_users.json()["detail"])

        res_analytics = client.get("/api/admin/analytics", headers=self.athlete_headers)
        self.assertEqual(res_analytics.status_code, 403)

        res_toggle = client.post(f"/api/admin/users/{self.athlete_id}/status", headers=self.athlete_headers)
        self.assertEqual(res_toggle.status_code, 403)

    def test_03_admin_lists_users_with_sanitized_credentials(self):
        """Admin can list users. Never exposes password hashes or secrets."""
        res = client.get("/api/admin/users", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        users = res.json()

        self.assertIsInstance(users, list)
        self.assertTrue(len(users) >= 2)

        # Check sanitization
        for u in users:
            self.assertNotIn("hashed_password", u)
            self.assertNotIn("password", u)
            self.assertNotIn("secret", u)
            self.assertIn("id", u)
            self.assertIn("email", u)
            self.assertIn("role", u)
            self.assertIn("status", u)
            self.assertIn("workoutsCompleted", u)
            self.assertIn("goal", u)

    def test_04_admin_filters_and_searches_users(self):
        """Search and status filtering work accurately."""
        # Search by email snippet
        res_search = client.get(f"/api/admin/users?search={self.athlete_email}", headers=self.admin_headers)
        self.assertEqual(res_search.status_code, 200)
        search_data = res_search.json()
        self.assertEqual(len(search_data), 1)
        self.assertEqual(search_data[0]["email"], self.athlete_email)

        # Filter by status
        res_active = client.get("/api/admin/users?status=Active", headers=self.admin_headers)
        self.assertEqual(res_active.status_code, 200)
        self.assertTrue(all(u["status"] == "Active" for u in res_active.json()))

    def test_05_admin_suspends_athlete_account(self):
        """Admin toggles athlete to Suspended. Returns updated user record."""
        res = client.post(f"/api/admin/users/{self.athlete_id}/status", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "Suspended")

    def test_06_suspended_account_jwt_session_immediately_rejected(self):
        """Athlete with an existing valid JWT token is rejected with 403 on protected routes."""
        res_me = client.get("/api/auth/me", headers=self.athlete_headers)
        self.assertEqual(res_me.status_code, 403)
        self.assertIn("Account is suspended", res_me.json()["detail"])

        # Also rejected on workouts and nutrition
        res_workout = client.get("/api/workouts/history", headers=self.athlete_headers)
        self.assertEqual(res_workout.status_code, 403)

        res_nutrition = client.get("/api/nutrition/daily", headers=self.athlete_headers)
        self.assertEqual(res_nutrition.status_code, 403)

    def test_07_suspended_user_cannot_login(self):
        """Attempting to login to a suspended account returns 403 Forbidden."""
        res_login = client.post(
            "/api/auth/login",
            json={"email": self.athlete_email, "password": self.athlete_pass},
        )
        self.assertEqual(res_login.status_code, 403)
        self.assertIn("Account is suspended", res_login.json()["detail"])

    def test_08_admin_reactivates_suspended_account(self):
        """Admin reactivates suspended account; athlete can login and access routes again."""
        res = client.post(
            f"/api/admin/users/{self.athlete_id}/status",
            json={"status": "Active"},
            headers=self.admin_headers,
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "Active")

        # Athlete can login again
        res_login = client.post(
            "/api/auth/login",
            json={"email": self.athlete_email, "password": self.athlete_pass},
        )
        self.assertEqual(res_login.status_code, 200)
        new_token = res_login.json()["access_token"]
        new_headers = {"Authorization": f"Bearer {new_token}"}

        # Protected route functions normally
        res_me = client.get("/api/auth/me", headers=new_headers)
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.json()["user"]["email"], self.athlete_email)

    def test_09_admin_cannot_suspend_themselves(self):
        """Self-suspension by an administrator is rejected with 400 Bad Request."""
        res = client.post(f"/api/admin/users/{self.admin_user_id}/status", headers=self.admin_headers)
        self.assertEqual(res.status_code, 400)
        self.assertIn("cannot suspend their own account", res.json()["detail"])

    def test_10_admin_creates_new_athlete_slot(self):
        """Admin can register an athlete slot with default biometrics."""
        ts = int(datetime.now().timestamp() * 1000)
        new_email = f"staff_created_{ts}@pulseai.com"
        payload = {
            "name": "Staff Managed Athlete",
            "email": new_email,
            "goal": "Core Strength & Endurance",
        }
        res = client.post("/api/admin/athletes", json=payload, headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["email"], new_email)
        self.assertEqual(data["goal"], "Core Strength & Endurance")
        self.assertEqual(data["status"], "Active")

    def test_11_admin_system_analytics_reflects_database(self):
        """System analytics returns live database counts and hardware diagnostics."""
        res = client.get("/api/admin/analytics", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertIn("activeAthletes", data)
        self.assertIn("totalAthletes", data)
        self.assertIn("hardwareDiagnostics", data)
        self.assertIn("movementCatalogStats", data)
        self.assertTrue(data["totalAthletes"] >= 2)
        self.assertTrue(len(data["hardwareDiagnostics"]) >= 4)

    def test_12_admin_activity_log_feed(self):
        """Activity feed retrieves real database event logs."""
        res = client.get("/api/admin/activity", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        logs = res.json()

        self.assertIsInstance(logs, list)
        self.assertTrue(len(logs) > 0)
        # Verify structure
        for log in logs:
            self.assertIn("id", log)
            self.assertIn("type", log)
            self.assertIn("title", log)
            self.assertIn("detail", log)
            self.assertIn("severity", log)


if __name__ == "__main__":
    unittest.main()
