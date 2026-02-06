#!/bin/bash

# NGO Request Fetch APIs - Test Script
# This script tests all 5 GET endpoints for NGO requests

BASE_URL="http://localhost:3000/api"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}NGO Request Fetch APIs - Test Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# ============================================================================
# Test 1: Fetch ALL NGO Requests
# ============================================================================
echo -e "${YELLOW}[Test 1] Fetch ALL NGO Requests${NC}"
echo "GET $BASE_URL/ngo-requests?page=1&pageSize=10"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests?page=1&pageSize=10" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract first request ID for later tests
REQUEST_ID=$(echo "$RESPONSE" | jq -r '.data[0].id' 2>/dev/null)

if [ "$REQUEST_ID" != "null" ] && [ ! -z "$REQUEST_ID" ]; then
  echo -e "${GREEN}✓ Found request ID: $REQUEST_ID${NC}"
else
  echo -e "${RED}✗ No requests found in database${NC}"
  REQUEST_ID="00000000-0000-0000-0000-000000000000" # Use dummy ID for testing
fi
echo ""

# ============================================================================
# Test 2: Fetch NGO Request by ID
# ============================================================================
echo -e "${YELLOW}[Test 2] Fetch NGO Request by ID${NC}"
echo "GET $BASE_URL/ngo-requests/$REQUEST_ID"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests/$REQUEST_ID" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract disaster ID, NGO ID, and government ID for other tests
DISASTER_ID=$(echo "$RESPONSE" | jq -r '.data.disasterId' 2>/dev/null)
NGO_ID=$(echo "$RESPONSE" | jq -r '.data.ngoId' 2>/dev/null)
GOVERNMENT_ID=$(echo "$RESPONSE" | jq -r '.data.governmentId' 2>/dev/null)

if [ "$DISASTER_ID" != "null" ] && [ ! -z "$DISASTER_ID" ]; then
  echo -e "${GREEN}✓ Found disaster ID: $DISASTER_ID${NC}"
else
  echo -e "${RED}✗ Could not extract disaster ID${NC}"
  DISASTER_ID="00000000-0000-0000-0000-000000000000"
fi

if [ "$NGO_ID" != "null" ] && [ ! -z "$NGO_ID" ]; then
  echo -e "${GREEN}✓ Found NGO ID: $NGO_ID${NC}"
else
  echo -e "${RED}✗ Could not extract NGO ID${NC}"
  NGO_ID="00000000-0000-0000-0000-000000000000"
fi

if [ "$GOVERNMENT_ID" != "null" ] && [ ! -z "$GOVERNMENT_ID" ]; then
  echo -e "${GREEN}✓ Found government ID: $GOVERNMENT_ID${NC}"
else
  echo -e "${RED}✗ Could not extract government ID${NC}"
  GOVERNMENT_ID="00000000-0000-0000-0000-000000000000"
fi
echo ""

# ============================================================================
# Test 3: Fetch NGO Requests by Disaster ID
# ============================================================================
echo -e "${YELLOW}[Test 3] Fetch NGO Requests by Disaster ID${NC}"
echo "GET $BASE_URL/ngo-requests/disaster/$DISASTER_ID?page=1&pageSize=10"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests/disaster/$DISASTER_ID?page=1&pageSize=10" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============================================================================
# Test 4: Fetch NGO Requests by NGO ID
# ============================================================================
echo -e "${YELLOW}[Test 4] Fetch NGO Requests by NGO ID${NC}"
echo "GET $BASE_URL/ngo-requests/ngo/$NGO_ID?page=1&pageSize=10"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests/ngo/$NGO_ID?page=1&pageSize=10" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============================================================================
# Test 5: Fetch NGO Requests by Government ID
# ============================================================================
echo -e "${YELLOW}[Test 5] Fetch NGO Requests by Government ID${NC}"
echo "GET $BASE_URL/ngo-requests/government/$GOVERNMENT_ID?page=1&pageSize=10"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests/government/$GOVERNMENT_ID?page=1&pageSize=10" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============================================================================
# Error Case Tests
# ============================================================================
echo -e "${YELLOW}[Test 6] Error Case - Invalid Request ID${NC}"
echo "GET $BASE_URL/ngo-requests/invalid-id"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests/invalid-id" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============================================================================
# Pagination Test
# ============================================================================
echo -e "${YELLOW}[Test 7] Pagination Test - Page 2, Size 5${NC}"
echo "GET $BASE_URL/ngo-requests?page=2&pageSize=5"
echo ""

RESPONSE=$(curl -s -X GET "$BASE_URL/ngo-requests?page=2&pageSize=5" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ All tests completed${NC}"
echo -e "\nEndpoints tested:"
echo -e "  1. GET /api/ngo-requests (fetch all)"
echo -e "  2. GET /api/ngo-requests/:id (fetch by ID)"
echo -e "  3. GET /api/ngo-requests/disaster/:disasterId (fetch by disaster)"
echo -e "  4. GET /api/ngo-requests/ngo/:ngoId (fetch by NGO)"
echo -e "  5. GET /api/ngo-requests/government/:governmentId (fetch by government)"
echo -e "\nNote: Replace IDs with actual UUIDs from your database for proper testing"
