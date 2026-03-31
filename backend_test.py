#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta
import uuid

class TheFriendAPITester:
    def __init__(self, base_url="https://app-concept-25.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = None
        self.test_user_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def test_api_health(self):
        """Test if API is accessible"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f" - {data.get('message', '')}"
            return self.log_test("API Health Check", success, details)
        except Exception as e:
            return self.log_test("API Health Check", False, f"Error: {str(e)}")

    def test_user_registration(self):
        """Test user registration"""
        try:
            user_data = {
                "name": "Test Kid",
                "age": 10,
                "gender": "other",
                "email": self.test_user_email
            }
            response = requests.post(f"{self.api_url}/users", json=user_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.test_user_id = data.get("id")
                details = f"User ID: {self.test_user_id}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            return self.log_test("User Registration", success, details)
        except Exception as e:
            return self.log_test("User Registration", False, f"Error: {str(e)}")

    def test_get_user_by_id(self):
        """Test getting user by ID"""
        if not self.test_user_id:
            return self.log_test("Get User by ID", False, "No test user ID available")
        
        try:
            response = requests.get(f"{self.api_url}/users/{self.test_user_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Name: {data.get('name')}, Age: {data.get('age')}"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Get User by ID", success, details)
        except Exception as e:
            return self.log_test("Get User by ID", False, f"Error: {str(e)}")

    def test_get_user_by_email(self):
        """Test getting user by email"""
        try:
            response = requests.get(f"{self.api_url}/users/email/{self.test_user_email}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found user: {data.get('name')}"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Get User by Email", success, details)
        except Exception as e:
            return self.log_test("Get User by Email", False, f"Error: {str(e)}")

    def test_mood_checkin(self):
        """Test mood check-in creation"""
        if not self.test_user_id:
            return self.log_test("Mood Check-in", False, "No test user ID available")
        
        try:
            checkin_data = {
                "user_id": self.test_user_id,
                "mood_score": 4,
                "mood_emoji": "😊",
                "is_bothered": False,
                "is_sad": False,
                "notes": "Test checkin"
            }
            response = requests.post(f"{self.api_url}/checkins", json=checkin_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Checkin ID: {data.get('id')}, Mood: {data.get('mood_emoji')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            return self.log_test("Mood Check-in", success, details)
        except Exception as e:
            return self.log_test("Mood Check-in", False, f"Error: {str(e)}")

    def test_get_today_checkin(self):
        """Test getting today's check-in status"""
        if not self.test_user_id:
            return self.log_test("Get Today Checkin", False, "No test user ID available")
        
        try:
            response = requests.get(f"{self.api_url}/checkins/{self.test_user_id}/today", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Checked in: {data.get('checked_in')}"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Get Today Checkin", success, details)
        except Exception as e:
            return self.log_test("Get Today Checkin", False, f"Error: {str(e)}")

    def test_get_user_checkins(self):
        """Test getting user's check-in history"""
        if not self.test_user_id:
            return self.log_test("Get User Checkins", False, "No test user ID available")
        
        try:
            response = requests.get(f"{self.api_url}/checkins/{self.test_user_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} checkins"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Get User Checkins", success, details)
        except Exception as e:
            return self.log_test("Get User Checkins", False, f"Error: {str(e)}")

    def test_complete_good_deed(self):
        """Test completing a good deed"""
        if not self.test_user_id:
            return self.log_test("Complete Good Deed", False, "No test user ID available")
        
        try:
            deed_data = {
                "user_id": self.test_user_id,
                "deed_id": "1"
            }
            response = requests.post(f"{self.api_url}/deeds", json=deed_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Deed ID: {data.get('deed_id')}, Completed: {data.get('completed_at')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            return self.log_test("Complete Good Deed", success, details)
        except Exception as e:
            return self.log_test("Complete Good Deed", False, f"Error: {str(e)}")

    def test_get_user_deeds(self):
        """Test getting user's completed deeds"""
        if not self.test_user_id:
            return self.log_test("Get User Deeds", False, "No test user ID available")
        
        try:
            response = requests.get(f"{self.api_url}/deeds/{self.test_user_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Found {len(data)} completed deeds"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Get User Deeds", success, details)
        except Exception as e:
            return self.log_test("Get User Deeds", False, f"Error: {str(e)}")

    def test_emotional_analysis(self):
        """Test emotional analysis endpoint"""
        if not self.test_user_id:
            return self.log_test("Emotional Analysis", False, "No test user ID available")
        
        try:
            response = requests.get(f"{self.api_url}/analysis/{self.test_user_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Score: {data.get('overall_score')}, Trend: {data.get('trend')}"
            else:
                details = f"Status: {response.status_code}"
            
            return self.log_test("Emotional Analysis", success, details)
        except Exception as e:
            return self.log_test("Emotional Analysis", False, f"Error: {str(e)}")

    def test_avatar_update(self):
        """Test avatar update"""
        if not self.test_user_id:
            return self.log_test("Avatar Update", False, "No test user ID available")
        
        try:
            avatar_data = {
                "avatar_face": 2,
                "avatar_hair": 1,
                "avatar_clothes": 3
            }
            response = requests.patch(f"{self.api_url}/users/{self.test_user_id}/avatar", json=avatar_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Face: {data.get('avatar_face')}, Hair: {data.get('avatar_hair')}, Clothes: {data.get('avatar_clothes')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text}"
            
            return self.log_test("Avatar Update", success, details)
        except Exception as e:
            return self.log_test("Avatar Update", False, f"Error: {str(e)}")

    def test_content_endpoints(self):
        """Test static content endpoints"""
        endpoints = [
            ("supportive-messages", "Supportive Messages"),
            ("good-deeds", "Good Deeds"),
            ("daily-questions", "Daily Questions")
        ]
        
        all_passed = True
        for endpoint, name in endpoints:
            try:
                response = requests.get(f"{self.api_url}/content/{endpoint}", timeout=10)
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    details = f"Found {len(data)} items"
                else:
                    details = f"Status: {response.status_code}"
                
                if not self.log_test(f"Content - {name}", success, details):
                    all_passed = False
            except Exception as e:
                self.log_test(f"Content - {name}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed

    def test_duplicate_checkin_prevention(self):
        """Test that duplicate check-ins are prevented"""
        if not self.test_user_id:
            return self.log_test("Duplicate Checkin Prevention", False, "No test user ID available")
        
        try:
            checkin_data = {
                "user_id": self.test_user_id,
                "mood_score": 3,
                "mood_emoji": "😐",
                "is_bothered": False,
                "is_sad": False
            }
            response = requests.post(f"{self.api_url}/checkins", json=checkin_data, timeout=10)
            success = response.status_code == 400  # Should fail with 400
            
            if success:
                details = "Correctly prevented duplicate checkin"
            else:
                details = f"Status: {response.status_code} (expected 400)"
            
            return self.log_test("Duplicate Checkin Prevention", success, details)
        except Exception as e:
            return self.log_test("Duplicate Checkin Prevention", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting theFRIEND API Tests...")
        print("=" * 50)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Test user management
        self.test_user_registration()
        self.test_get_user_by_id()
        self.test_get_user_by_email()
        
        # Test mood check-ins
        self.test_mood_checkin()
        self.test_get_today_checkin()
        self.test_get_user_checkins()
        self.test_duplicate_checkin_prevention()
        
        # Test good deeds
        self.test_complete_good_deed()
        self.test_get_user_deeds()
        
        # Test analysis
        self.test_emotional_analysis()
        
        # Test avatar
        self.test_avatar_update()
        
        # Test content endpoints
        self.test_content_endpoints()
        
        # Print summary
        print("=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = TheFriendAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())