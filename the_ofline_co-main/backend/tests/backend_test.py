"""Backend API regression tests for The Ofline Co."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://immersive-getaway.preview.emergentagent.com").rstrip("/")


# ---------- Public ----------
class TestHealth:
    def test_health_ok(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["service"] == "ofline-co"


class TestExperiences:
    def test_list_experiences(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/experiences", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        slugs = [i["slug"] for i in items]
        assert "shantiniketan-mati" in slugs
        assert "dooars-wood-smoke" in slugs
        assert "daringbadi-pine-smoke" in slugs
        assert "satkosia-river-hours" in slugs
        # verify no _id leakage
        for i in items:
            assert "_id" not in i

    def test_get_experience_by_slug(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/experiences/shantiniketan-mati", timeout=20)
        assert r.status_code == 200
        item = r.json()
        assert item["slug"] == "shantiniketan-mati"
        assert isinstance(item.get("chapters"), list)
        assert len(item["chapters"]) > 0
        assert "_id" not in item

    def test_get_experience_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/experiences/nonexistent-slug-zzz", timeout=20)
        assert r.status_code == 404


class TestCountdown:
    def test_get_countdown(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/countdown", timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert "next_reveal_at" in d
        assert "location_label" in d
        assert "seats_remaining" in d
        assert "_id" not in d


class TestTestimonials:
    def test_list_testimonials(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/testimonials", timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 3
        for i in items:
            assert "_id" not in i
            assert "quote" in i
            assert "attribution" in i


class TestApplications:
    def test_create_application_valid(self, api_client):
        payload = {
            "alias": "TEST_river_walker",
            "email": "test_apply@example.com",
            "why_offline": "I want to log out and show up. This is a test application paragraph.",
        }
        r = api_client.post(f"{BASE_URL}/api/applications", json=payload, timeout=20)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["alias"] == payload["alias"]
        assert data["email"] == payload["email"]
        assert data["status"] == "pending"
        assert "id" in data
        assert "_id" not in data

    def test_create_application_invalid_email(self, api_client):
        payload = {
            "alias": "TEST_bad",
            "email": "not-an-email",
            "why_offline": "Some valid text here that is long enough.",
        }
        r = api_client.post(f"{BASE_URL}/api/applications", json=payload, timeout=20)
        assert r.status_code == 422

    def test_create_application_short_why(self, api_client):
        payload = {
            "alias": "TEST_short",
            "email": "test@example.com",
            "why_offline": "short",
        }
        r = api_client.post(f"{BASE_URL}/api/applications", json=payload, timeout=20)
        assert r.status_code == 422


# ---------- Auth ----------
class TestAuth:
    def test_login_valid(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@theofflineco.com", "password": "Offline@2025"},
            timeout=20,
        )
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "admin@theofflineco.com"
        assert data["user"]["role"] == "admin"

    def test_login_invalid(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@theofflineco.com", "password": "wrong"},
            timeout=20,
        )
        assert r.status_code == 401

    def test_admin_apps_no_token(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/admin/applications", timeout=20)
        assert r.status_code == 401


# ---------- Admin (auth required) ----------
class TestAdminApplications:
    def test_admin_list_applications(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/applications", timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_patch_application_status(self, auth_client):
        # Create one first
        cr = auth_client.post(
            f"{BASE_URL}/api/applications",
            json={
                "alias": "TEST_patch_alias",
                "email": "test_patch@example.com",
                "why_offline": "A long enough reason for testing patches.",
            },
            timeout=20,
        )
        assert cr.status_code == 201
        app_id = cr.json()["id"]

        r = auth_client.patch(
            f"{BASE_URL}/api/admin/applications/{app_id}",
            json={"status": "selected"},
            timeout=20,
        )
        assert r.status_code == 200
        assert r.json()["status"] == "selected"

        # Verify persistence by listing
        lr = auth_client.get(f"{BASE_URL}/api/admin/applications", timeout=20)
        match = [a for a in lr.json() if a["id"] == app_id]
        assert match and match[0]["status"] == "selected"

        # cleanup
        auth_client.delete(f"{BASE_URL}/api/admin/applications/{app_id}", timeout=20)


class TestAdminExperiences:
    def test_create_update_delete(self, auth_client):
        slug = f"test-exp-{uuid.uuid4().hex[:8]}"
        payload = {
            "slug": slug,
            "title": "Test Experience",
            "region_hint": "Somewhere quiet",
            "cover_image": "https://example.com/x.jpg",
            "duration": "48 hours",
            "cohort_size": 12,
            "price_inr": 13000,
            "summary": "Test summary",
            "chapters": ["one", "two"],
            "published": True,
        }
        r = auth_client.post(f"{BASE_URL}/api/admin/experiences", json=payload, timeout=20)
        assert r.status_code == 201, r.text
        exp = r.json()
        exp_id = exp["id"]
        assert exp["slug"] == slug

        # Update
        ur = auth_client.patch(
            f"{BASE_URL}/api/admin/experiences/{exp_id}",
            json={"title": "Updated Title"},
            timeout=20,
        )
        assert ur.status_code == 200
        assert ur.json()["title"] == "Updated Title"

        # Verify persistence via public endpoint
        pr = auth_client.get(f"{BASE_URL}/api/experiences/{slug}", timeout=20)
        assert pr.status_code == 200
        assert pr.json()["title"] == "Updated Title"

        # Delete
        dr = auth_client.delete(f"{BASE_URL}/api/admin/experiences/{exp_id}", timeout=20)
        assert dr.status_code == 200

        # Verify gone
        gr = auth_client.get(f"{BASE_URL}/api/experiences/{slug}", timeout=20)
        assert gr.status_code == 404


class TestAdminCountdown:
    def test_update_countdown(self, auth_client):
        from datetime import datetime, timezone, timedelta
        future = (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()
        r = auth_client.put(
            f"{BASE_URL}/api/admin/countdown",
            json={
                "next_reveal_at": future,
                "location_label": "TEST label",
                "seats_remaining": 9,
            },
            timeout=20,
        )
        assert r.status_code == 200
        d = r.json()
        assert d["seats_remaining"] == 9
        assert d["location_label"] == "TEST label"


class TestAdminTestimonials:
    def test_create_and_delete(self, auth_client):
        r = auth_client.post(
            f"{BASE_URL}/api/admin/testimonials",
            json={"quote": "TEST_quote_unique_xyz", "attribution": "TEST_attr"},
            timeout=20,
        )
        assert r.status_code == 201
        tid = r.json()["id"]

        # Verify it's listed
        lr = auth_client.get(f"{BASE_URL}/api/testimonials", timeout=20)
        assert any(t["id"] == tid for t in lr.json())

        dr = auth_client.delete(f"{BASE_URL}/api/admin/testimonials/{tid}", timeout=20)
        assert dr.status_code == 200


# ---------- Razorpay ----------
class TestPayments:
    def test_razorpay_order_unconfigured(self, api_client):
        # Get an experience id
        er = api_client.get(f"{BASE_URL}/api/experiences", timeout=20)
        exp_id = er.json()[0]["id"]
        r = api_client.post(
            f"{BASE_URL}/api/payments/razorpay/order",
            json={"experience_id": exp_id, "alias": "TEST", "email": "t@e.com"},
            timeout=20,
        )
        assert r.status_code == 503
        body = r.json()
        assert "detail" in body
        assert "unavailable" in body["detail"].lower() or "payment" in body["detail"].lower()
