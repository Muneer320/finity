"""End-to-end contracts for the local paper trading demo."""

import os
import tempfile
import unittest
from pathlib import Path

os.environ["DATABASE_URL"] = f"sqlite:///{(Path(tempfile.mkdtemp()) / 'finity_test.db').as_posix()}"
os.environ["SECRET_KEY"] = "local-test-secret-only"

from fastapi.testclient import TestClient
from main import app


class DemoContract(unittest.TestCase):
    def test_accounts_trades_and_records(self):
        with TestClient(app) as client:
            for email in ("alice@example.com", "bob@example.com"):
                result = client.post("/signup", json={"email": email, "password": "test-password"})
                self.assertEqual(result.status_code, 200, result.text)
            alice = client.post("/login", json={"email": "alice@example.com", "password": "test-password"}).json()
            bob = client.post("/login", json={"email": "bob@example.com", "password": "test-password"}).json()
            a = {"Authorization": f"Bearer {alice['access_token']}"}
            b = {"Authorization": f"Bearer {bob['access_token']}"}
            feed = client.get("/market/live-feed", headers=a).json()
            self.assertEqual(feed["available_balance"], 100000)
            self.assertEqual(feed["available_stocks"][0]["symbol"], "TECH")
            trade = {"asset_type": "Stock", "symbol": "TECH", "action": "Buy", "amount": 2}
            self.assertEqual(client.post("/simulate/invest/action", headers=a, json=trade).status_code, 200)
            self.assertEqual(client.get("/market/live-feed", headers=a).json()["available_balance"], 95000)
            self.assertEqual(client.get("/market/live-feed", headers=b).json()["available_balance"], 100000)
            self.assertEqual(client.post("/simulate/invest/action", headers=a, json={**trade, "amount": 100}).status_code, 400)
            self.assertEqual(client.post("/simulate/invest/action", headers=a, json={**trade, "action": "Sell", "amount": 3}).status_code, 400)
            self.assertEqual(client.post("/simulate/invest/action", headers=a, json={**trade, "symbol": "FAKE"}).status_code, 400)
            self.assertEqual(client.post("/simulate/invest/action", headers=a, json={**trade, "action": "Sell", "amount": 1}).status_code, 200)
            self.assertEqual(client.get("/market/live-feed", headers=a).json()["available_balance"], 97500)
            entry = client.post("/expenses", headers=a, json={"amount": 123, "category": "Food"}).json()
            self.assertEqual(len(client.get("/expenses", headers=a).json()), 1)
            self.assertEqual(client.get("/expenses", headers=b).json(), [])
            self.assertEqual(client.get("/gamification/streak", headers=a).json()["streak"], 1)
            self.assertEqual(client.delete(f"/expenses/{entry['id']}", headers=b).status_code, 404)
            self.assertEqual(client.delete(f"/expenses/{entry['id']}", headers=a).status_code, 204)
            self.assertEqual(client.patch("/users/me", headers=a, json={"age": 25, "occupation": "student"}).json()["age"], 25)
            self.assertEqual(client.post("/achievements", headers=a, json={"name": "First Trade"}).status_code, 200)
            self.assertIn("First Trade", client.get("/users/me", headers=a).json()["achievements"])
            self.assertEqual(client.post("/chat", headers=a, json={"message": "What is compound interest?", "history": []}).status_code, 200)


if __name__ == "__main__":
    unittest.main()
