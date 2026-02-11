#!/bin/bash

# ============================================================================
# Role Preference Request API - Testing Script
# ============================================================================
# This file contains example curl commands to test the role preference system
# ============================================================================

# Variables - Update these with your actual data
BASE_URL="http://localhost:3000"
NGO_ID="your-ngo-uuid-here"
STATE="Maharashtra"
ADMIN_EMAIL="admin@ngo.com"
ADMIN_PASSWORD="AdminPassword123!"
NEW_USER_EMAIL="newuser@example.com"
NEW_USER_PASSWORD="UserPassword123!"
USER_NAME="John Doe"
USER_PHONE="9876543210"
PREFERRED_ROLE="MEDICAL_VOLUNTEER"
APPROVED_ROLE="RESCUE_VOLUNTEER"

# ============================================================================
# 1. USER SIGNUP WITH ROLE PREFERENCE REQUEST
# ============================================================================
# No authentication required
# Returns: User details + Role preference request status

echo "===== Step 1: User Signup with Role Preference ====="
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup-with-role-preference" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$USER_NAME\",
    \"email\": \"$NEW_USER_EMAIL\",
    \"password\": \"$NEW_USER_PASSWORD\",
    \"phone\": \"$USER_PHONE\",
    \"ngoId\": \"$NGO_ID\",
    \"state\": \"$STATE\",
    \"preferredRole\": \"$PREFERRED_ROLE\"
  }")

echo "Response: $SIGNUP_RESPONSE"

# Extract requestId from response (you'll need to parse this based on response structure)
# REQUEST_ID=$(echo $SIGNUP_RESPONSE | jq -r '.rolePreferenceRequest.id')
# USER_ID=$(echo $SIGNUP_RESPONSE | jq -r '.user.id')
REQUEST_ID="your-request-uuid-from-signup-response"
USER_ID="your-user-uuid-from-signup-response"

echo "Request ID: $REQUEST_ID"
echo "User ID: $USER_ID"

# ============================================================================
# 2. NGO ADMIN LOGIN (Get JWT Token)
# ============================================================================
# Returns: accessToken that will be used in subsequent requests

echo -e "\n===== Step 2: NGO Admin Login ====="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/regenerate-token" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "Response: $LOGIN_RESPONSE"

# Extract token from response
# ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
ADMIN_TOKEN="your-jwt-token-from-login-response"

echo "Admin Token: $ADMIN_TOKEN (this will be stored in cookies automatically)"

# ============================================================================
# 3. NGO ADMIN VIEWS ALL PENDING ROLE REQUESTS
# ============================================================================
# Requires: JWT token in cookie or Authorization header
# Shows only requests for admin's NGO and state

echo -e "\n===== Step 3: View Pending Role Requests ====="
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests?status=PENDING" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# Or using Authorization header:
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests?status=PENDING" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# ============================================================================
# 4. NGO ADMIN VIEWS ALL REQUESTS (No status filter)
# ============================================================================

echo -e "\n===== Step 4: View All Role Requests (all statuses) ====="
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# ============================================================================
# 5. NGO ADMIN APPROVES REQUEST AND ASSIGNS ROLE
# ============================================================================
# Requires: JWT token in cookie
# Verifies request belongs to admin's NGO and state

echo -e "\n===== Step 5: Approve Request and Assign Role ====="
curl -s -X POST "$BASE_URL/api/ngo/role-preference-requests/$REQUEST_ID" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"requestId\": \"$REQUEST_ID\",
    \"approvedRole\": \"$APPROVED_ROLE\"
  }" | jq .

# ============================================================================
# 6. NGO ADMIN VIEWS APPROVED REQUESTS
# ============================================================================

echo -e "\n===== Step 6: View Approved Requests ====="
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests?status=APPROVED" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# ============================================================================
# 7. NGO ADMIN REJECTS A REQUEST (Alternative to Approve)
# ============================================================================
# Instead of approving, admin can reject the request

echo -e "\n===== Step 7: Reject a Request ====="
curl -s -X DELETE "$BASE_URL/api/ngo/role-preference-requests/$REQUEST_ID" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# ============================================================================
# ERROR SCENARIOS - Testing Error Handling
# ============================================================================

# Test 1: Signup with existing email (should return 409)
echo -e "\n===== Test 1: Signup with Duplicate Email (409) ====="
curl -s -X POST "$BASE_URL/api/auth/signup-with-role-preference" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Duplicate User\",
    \"email\": \"$NEW_USER_EMAIL\",
    \"password\": \"Password123!\",
    \"ngoId\": \"$NGO_ID\",
    \"state\": \"$STATE\",
    \"preferredRole\": \"MEDICAL_VOLUNTEER\"
  }" | jq .

# Test 2: Missing authentication token (should return 401)
echo -e "\n===== Test 2: Missing Authentication Token (401) ====="
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests" \
  -H "Content-Type: application/json" | jq .

# Test 3: Invalid JWT token (should return 401)
echo -e "\n===== Test 3: Invalid JWT Token (401) ====="
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests" \
  -H "Cookie: accessToken=invalid-token-here" \
  -H "Content-Type: application/json" | jq .

# Test 4: Non-admin user trying to approve (should return 403)
echo -e "\n===== Test 4: Non-Admin User (403) ====="
# Login as regular user (without NGO credentials)
curl -s -X GET "$BASE_URL/api/ngo/role-preference-requests" \
  -H "Cookie: accessToken=$USER_TOKEN" \
  -H "Content-Type: application/json" | jq .

# ============================================================================
# INTEGRATION TEST - Complete Flow
# ============================================================================

echo -e "\n===== COMPLETE INTEGRATION TEST ====="
echo "1. Create new user with role preference"
echo "2. Admin views pending requests"
echo "3. Admin approves the request"
echo "4. Admin views approved requests"
echo "5. Verify user now has role assigned"

# ============================================================================
# SECURITY TESTS
# ============================================================================

echo -e "\n===== SECURITY TEST: Cross-NGO Prevention ====="
echo "When NGO Admin tries to approve request from different NGO/state:"
echo "- Expected: 403 Forbidden"
echo "- Reason: Request.ngoId !== token.ngoId OR Request.state !== token.state"

echo -e "\n===== SECURITY TEST: Duplicate Request Prevention ====="
echo "When user tries to submit second request for same NGO:"
echo "- Expected: Fails due to unique constraint (userId, ngoId)"
echo "- Or: 409 Conflict if duplicate detection is implemented in API"

echo -e "\n===== SECURITY TEST: State Mismatch ====="
echo "When creating user with state that doesn't match NGO state:"
echo "- Expected: 400 Bad Request"
echo "- Reason: NGO operates in different state"

# ============================================================================
# USEFUL jq FILTERS
# ============================================================================

# Extract just the request status
# curl ... | jq '.rolePreferenceRequest.status'

# Extract all requests
# curl ... | jq '.requests[]'

# Extract just user emails from requests
# curl ... | jq '.requests[].userEmail'

# Count pending requests
# curl ... | jq '.requests | map(select(.status=="PENDING")) | length'

# ============================================================================
# NOTES
# ============================================================================

# 1. Replace variables with actual UUIDs and credentials
# 2. JWT tokens typically last 15 minutes - you may need to re-login
# 3. The cookie will be set automatically by the browser/client
# 4. For Bearer token auth, include "Authorization: Bearer <token>" header
# 5. State filtering is case-sensitive
# 6. All timestamps are in ISO 8601 format
# 7. Database must be running and migrations applied before testing

# ============================================================================
