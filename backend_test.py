#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Pranay's Portfolio Website
Tests all endpoints including health check, reflections, contact form, and admin authentication
"""

import requests
import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from frontend .env file
def get_backend_url():
    """Get backend URL from frontend .env file"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"Testing backend API at: {API_BASE}")

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_session_id = None
        self.test_results = []
        self.created_reflection_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_health_check(self):
        """Test GET /api/ endpoint (health check)"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "timestamp" in data:
                    self.log_test("Health Check", True, f"Message: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, "Missing required fields in response")
                    return False
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_get_reflections_public(self):
        """Test GET /api/reflections (public endpoint)"""
        try:
            response = self.session.get(f"{API_BASE}/reflections")
            if response.status_code == 200:
                data = response.json()
                if "reflections" in data and "total" in data and "categories" in data:
                    reflections_count = len(data["reflections"])
                    self.log_test("Get Public Reflections", True, 
                                f"Retrieved {reflections_count} reflections, {data['total']} total")
                    return True
                else:
                    self.log_test("Get Public Reflections", False, "Missing required fields")
                    return False
            else:
                self.log_test("Get Public Reflections", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Public Reflections", False, f"Exception: {str(e)}")
            return False
    
    def test_get_reflections_with_category(self):
        """Test GET /api/reflections with category filter"""
        try:
            response = self.session.get(f"{API_BASE}/reflections?category=blog")
            if response.status_code == 200:
                data = response.json()
                blog_reflections = [r for r in data["reflections"] if r["category"] == "blog"]
                if len(blog_reflections) == len(data["reflections"]):
                    self.log_test("Get Reflections by Category", True, 
                                f"Retrieved {len(blog_reflections)} blog reflections")
                    return True
                else:
                    self.log_test("Get Reflections by Category", False, "Category filter not working")
                    return False
            else:
                self.log_test("Get Reflections by Category", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Reflections by Category", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_login_correct(self):
        """Test POST /api/admin/login with correct credentials"""
        try:
            login_data = {
                "username": "admin",
                "password": "pranay2024"
            }
            response = self.session.post(f"{API_BASE}/admin/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "session_id" in data:
                    self.admin_session_id = data["session_id"]
                    # Check if cookie was set
                    cookies = response.cookies
                    if "session_id" in cookies:
                        self.log_test("Admin Login (Correct)", True, "Login successful with session cookie")
                        return True
                    else:
                        self.log_test("Admin Login (Correct)", False, "No session cookie set")
                        return False
                else:
                    self.log_test("Admin Login (Correct)", False, f"Login failed: {data.get('message', 'Unknown error')}")
                    return False
            else:
                self.log_test("Admin Login (Correct)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Login (Correct)", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_login_incorrect(self):
        """Test POST /api/admin/login with incorrect credentials"""
        try:
            login_data = {
                "username": "admin",
                "password": "wrongpassword"
            }
            response = self.session.post(f"{API_BASE}/admin/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if not data.get("success"):
                    self.log_test("Admin Login (Incorrect)", True, "Correctly rejected invalid credentials")
                    return True
                else:
                    self.log_test("Admin Login (Incorrect)", False, "Should have rejected invalid credentials")
                    return False
            else:
                self.log_test("Admin Login (Incorrect)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Login (Incorrect)", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_verify(self):
        """Test GET /api/admin/verify (session verification)"""
        try:
            response = self.session.get(f"{API_BASE}/admin/verify")
            if response.status_code == 200:
                data = response.json()
                if data.get("valid"):
                    self.log_test("Admin Session Verify", True, "Session verified successfully")
                    return True
                else:
                    self.log_test("Admin Session Verify", False, f"Session invalid: {data.get('message')}")
                    return False
            else:
                self.log_test("Admin Session Verify", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Session Verify", False, f"Exception: {str(e)}")
            return False
    
    def test_get_reflections_admin(self):
        """Test GET /api/reflections-admin (admin endpoint)"""
        try:
            response = self.session.get(f"{API_BASE}/reflections-admin")
            if response.status_code == 200:
                data = response.json()
                if "reflections" in data and "total" in data:
                    self.log_test("Get Admin Reflections", True, 
                                f"Retrieved {len(data['reflections'])} admin reflections")
                    return True
                else:
                    self.log_test("Get Admin Reflections", False, "Missing required fields")
                    return False
            elif response.status_code == 401:
                self.log_test("Get Admin Reflections", False, "Unauthorized - session may have expired")
                return False
            else:
                self.log_test("Get Admin Reflections", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Admin Reflections", False, f"Exception: {str(e)}")
            return False
    
    def test_create_reflection(self):
        """Test POST /api/reflections (admin endpoint)"""
        try:
            reflection_data = {
                "title": "Test Reflection for API Testing",
                "excerpt": "This is a test reflection created during API testing to verify the create endpoint functionality.",
                "content": "This is the full content of the test reflection. It contains enough text to test the read time calculation feature. The content should be meaningful and demonstrate that the API can handle various types of reflection content including personal insights, professional experiences, and creative expressions.",
                "category": "journal",
                "tags": ["test", "api", "backend"],
                "published": True
            }
            
            response = self.session.post(f"{API_BASE}/reflections", json=reflection_data)
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["title"] == reflection_data["title"]:
                    self.created_reflection_id = data["id"]
                    self.log_test("Create Reflection", True, 
                                f"Created reflection with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Create Reflection", False, "Invalid response data")
                    return False
            elif response.status_code == 401:
                self.log_test("Create Reflection", False, "Unauthorized - admin session required")
                return False
            else:
                self.log_test("Create Reflection", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Create Reflection", False, f"Exception: {str(e)}")
            return False
    
    def test_update_reflection(self):
        """Test PUT /api/reflections/{id} (admin endpoint)"""
        if not self.created_reflection_id:
            self.log_test("Update Reflection", False, "No reflection ID available for update")
            return False
        
        try:
            update_data = {
                "title": "Updated Test Reflection",
                "excerpt": "This reflection has been updated during API testing.",
                "tags": ["test", "api", "backend", "updated"]
            }
            
            response = self.session.put(f"{API_BASE}/reflections/{self.created_reflection_id}", 
                                      json=update_data)
            if response.status_code == 200:
                data = response.json()
                if data["title"] == update_data["title"]:
                    self.log_test("Update Reflection", True, 
                                f"Updated reflection: {data['title']}")
                    return True
                else:
                    self.log_test("Update Reflection", False, "Update not applied correctly")
                    return False
            elif response.status_code == 401:
                self.log_test("Update Reflection", False, "Unauthorized - admin session required")
                return False
            elif response.status_code == 404:
                self.log_test("Update Reflection", False, "Reflection not found")
                return False
            else:
                self.log_test("Update Reflection", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Update Reflection", False, f"Exception: {str(e)}")
            return False
    
    def test_contact_form_valid(self):
        """Test POST /api/contact with valid data"""
        try:
            contact_data = {
                "name": "Arjun Sharma",
                "email": "arjun.sharma@example.com",
                "reason": "collaboration",
                "message": "Hi Pranay, I'm interested in discussing potential collaboration opportunities in the impact investing space. I've been following your work at Lok Capital and would love to explore how we might work together on projects that align with both financial returns and social impact."
            }
            
            response = self.session.post(f"{API_BASE}/contact", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "message" in data:
                    self.log_test("Contact Form (Valid)", True, 
                                f"Form submitted successfully: {data['message']}")
                    return True
                else:
                    self.log_test("Contact Form (Valid)", False, "Invalid response format")
                    return False
            else:
                self.log_test("Contact Form (Valid)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Contact Form (Valid)", False, f"Exception: {str(e)}")
            return False
    
    def test_contact_form_invalid(self):
        """Test POST /api/contact with invalid data"""
        try:
            contact_data = {
                "name": "",  # Invalid: empty name
                "email": "invalid-email",  # Invalid: bad email format
                "reason": "collaboration",
                "message": "Test message"
            }
            
            response = self.session.post(f"{API_BASE}/contact", json=contact_data)
            if response.status_code == 422:  # Validation error
                self.log_test("Contact Form (Invalid)", True, "Correctly rejected invalid data")
                return True
            elif response.status_code == 400:  # Bad request
                self.log_test("Contact Form (Invalid)", True, "Correctly rejected invalid data")
                return True
            else:
                self.log_test("Contact Form (Invalid)", False, 
                            f"Should have rejected invalid data, got status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Contact Form (Invalid)", False, f"Exception: {str(e)}")
            return False
    
    def test_unauthorized_access(self):
        """Test that admin endpoints require authentication"""
        # Create a new session without login
        temp_session = requests.Session()
        
        try:
            response = temp_session.get(f"{API_BASE}/reflections-admin")
            if response.status_code == 401:
                self.log_test("Unauthorized Access Protection", True, 
                            "Admin endpoint correctly requires authentication")
                return True
            else:
                self.log_test("Unauthorized Access Protection", False, 
                            f"Should have returned 401, got: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Unauthorized Access Protection", False, f"Exception: {str(e)}")
            return False
    
    def test_delete_reflection(self):
        """Test DELETE /api/reflections/{id} (admin endpoint)"""
        if not self.created_reflection_id:
            self.log_test("Delete Reflection", False, "No reflection ID available for deletion")
            return False
        
        try:
            response = self.session.delete(f"{API_BASE}/reflections/{self.created_reflection_id}")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Delete Reflection", True, 
                                f"Deleted reflection successfully: {data['message']}")
                    return True
                else:
                    self.log_test("Delete Reflection", False, "Invalid response format")
                    return False
            elif response.status_code == 401:
                self.log_test("Delete Reflection", False, "Unauthorized - admin session required")
                return False
            elif response.status_code == 404:
                self.log_test("Delete Reflection", False, "Reflection not found")
                return False
            else:
                self.log_test("Delete Reflection", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Delete Reflection", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        try:
            response = self.session.get(f"{API_BASE}/nonexistent")
            if response.status_code == 404:
                self.log_test("Invalid Endpoint (404)", True, "Correctly returned 404 for invalid endpoint")
                return True
            else:
                self.log_test("Invalid Endpoint (404)", False, 
                            f"Should have returned 404, got: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Invalid Endpoint (404)", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_logout(self):
        """Test POST /api/admin/logout"""
        try:
            response = self.session.post(f"{API_BASE}/admin/logout")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Admin Logout", True, f"Logout successful: {data['message']}")
                    return True
                else:
                    self.log_test("Admin Logout", False, "Invalid response format")
                    return False
            else:
                self.log_test("Admin Logout", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Logout", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 60)
        print("BACKEND API TESTING - PRANAY'S PORTFOLIO WEBSITE")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("Health Check & Basic Functionality", [
                self.test_health_check,
            ]),
            ("Public Reflections API", [
                self.test_get_reflections_public,
                self.test_get_reflections_with_category,
            ]),
            ("Admin Authentication", [
                self.test_admin_login_correct,
                self.test_admin_login_incorrect,
                self.test_admin_verify,
            ]),
            ("Admin Reflections API", [
                self.test_get_reflections_admin,
                self.test_create_reflection,
                self.test_update_reflection,
                self.test_delete_reflection,
            ]),
            ("Contact Form API", [
                self.test_contact_form_valid,
                self.test_contact_form_invalid,
            ]),
            ("Security & Error Handling", [
                self.test_unauthorized_access,
                self.test_invalid_endpoints,
            ]),
            ("Session Management", [
                self.test_admin_logout,
            ])
        ]
        
        total_tests = 0
        passed_tests = 0
        
        for section_name, section_tests in tests:
            print(f"\n--- {section_name} ---")
            for test_func in section_tests:
                total_tests += 1
                if test_func():
                    passed_tests += 1
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
            return True
        else:
            print(f"\n⚠️  {total_tests - passed_tests} tests failed. Check the details above.")
            return False

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)