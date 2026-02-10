# Implementation Summary: NGO Role Preference Request System

## Overview
A complete secure system for users to request roles in specific NGOs, with NGO admins viewing and approving/rejecting these requests with strict NGO and state isolation.

---

## Files Created / Modified

### 1. Database Schema Updates
**File:** [src/app/prisma/schema.prisma](src/app/prisma/schema.prisma)

**Changes:**
- ✅ Added `RolePreferenceRequest` model with fields: userId, ngoId, state, preferredRole, status, approvedRole, approvedAt, approvedBy
- ✅ Added `RolePreferenceRequestStatus` enum: PENDING, APPROVED, REJECTED
- ✅ Added relationships in User model: `rolePreferenceRequests`, `approvedRoleRequests`
- ✅ Added relationship in NGO model: `rolePreferenceRequests`
- ✅ Unique constraint on (userId, ngoId) to prevent duplicates
- ✅ Indexes on ngoId, state, status, and combined (ngoId, state) for performance

**Migration:** `20260203042005_add_role_preference_request` ✓ Applied

---

### 2. Repository Layer
**File:** [src/app/repositories/rolePreferenceRequest.repository.ts](src/app/repositories/rolePreferenceRequest.repository.ts)

**Functions:**
- `create()` - Create new role preference request during signup
- `findByNgoAndState()` - **Secure filtering** by ngoId AND state
- `findPendingByNgoAndState()` - Get only PENDING requests
- `findById()` - Get specific request details
- `approve()` - Approve with ownership verification
- `reject()` - Reject with ownership verification
- `findExisting()` - Check for duplicate requests

**Security Features:**
- ✅ Ownership verification before approve/reject
- ✅ Double-checks ngoId and state match
- ✅ Throws "Unauthorized" error if mismatch detected

---

### 3. API Endpoints

#### A. User Signup with Role Preference
**File:** [src/app/api/auth/signup-with-role-preference/route.ts](src/app/api/auth/signup-with-role-preference/route.ts)

**Method:** `POST /api/auth/signup-with-role-preference`

**Features:**
- ✅ No authentication required
- ✅ Validates email uniqueness
- ✅ Verifies NGO exists and state matches
- ✅ Hashes password using bcrypt
- ✅ Creates user and role preference request atomically
- ✅ Returns user details and request status

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "9876543210",
  "ngoId": "uuid-of-ngo",
  "state": "Maharashtra",
  "preferredRole": "MEDICAL_VOLUNTEER"
}
```

---

#### B. View Role Preference Requests (NGO Admin)
**File:** [src/app/api/ngo/role-preference-requests/route.ts](src/app/api/ngo/role-preference-requests/route.ts)

**Method:** `GET /api/ngo/role-preference-requests?status=PENDING`

**Features:**
- ✅ Requires JWT authentication
- ✅ **Automatically filters by ngoId and state from token**
- ✅ Prevents cross-NGO access at data level
- ✅ Optional status filter (PENDING, APPROVED, REJECTED)
- ✅ Returns detailed user information and request status

**Security:**
```typescript
// Only fetches requests matching admin's NGO and state
const requests = await RolePreferenceRequestRepository.findByNgoAndState(
  decoded.ngoId,    // From JWT token
  decoded.state     // From JWT token
);
```

---

#### C. Approve & Assign Role (NGO Admin)
**File:** [src/app/api/ngo/role-preference-requests/[requestId]/route.ts](src/app/api/ngo/role-preference-requests/%5brequestId%5d/route.ts)

**Method:** `POST /api/ngo/role-preference-requests/[requestId]`

**Features:**
- ✅ Requires JWT authentication
- ✅ Verifies request belongs to admin's NGO and state
- ✅ Only allows approval of PENDING requests
- ✅ Creates UserRole entry in database
- ✅ Prevents cross-NGO approvals

**Request:**
```json
{
  "requestId": "uuid-of-request",
  "approvedRole": "MEDICAL_VOLUNTEER"
}
```

**Security Checks:**
```typescript
// 1. Verify request exists
if (!request) throw new Error("Request not found");

// 2. Verify ownership - CRITICAL
if (request.ngoId !== approverNgoId || request.state !== approverState) {
  throw new Error("Unauthorized");
}

// 3. Verify status
if (request.status !== RolePreferenceRequestStatus.PENDING) {
  throw new Error("Request is not in PENDING status");
}
```

---

#### D. Reject Role Preference Request (NGO Admin)
**Method:** `DELETE /api/ngo/role-preference-requests/[requestId]`

**Features:**
- ✅ Requires JWT authentication
- ✅ Verifies request belongs to admin's NGO and state
- ✅ Only allows rejection of PENDING requests
- ✅ Returns rejection confirmation

**Same security checks as approval endpoint**

---

## Security Implementation

### 🔒 Multi-Layer Security

1. **Authentication Layer**
   - JWT token verification on all admin endpoints
   - Token expiration checks (15 minutes)
   - Support for cookies and Authorization header

2. **Authorization Layer**
   - Extracts ngoId and state from JWT payload
   - Verifies user has NGO admin credentials
   - Checks credentials on every request

3. **Data Access Layer**
   - Database queries automatically filtered by ngoId AND state
   - No way to retrieve requests from other NGOs
   - No way to access requests from other states

4. **Ownership Verification**
   - Before any modification, verify request ownership
   - Prevents cross-NGO attacks
   - Throws 403 Forbidden on mismatch

5. **Unique Constraints**
   - Only one request per user per NGO
   - Prevents duplicate submissions
   - Enforced at database level

### ❌ What This System Prevents

- ✓ One NGO admin cannot see another NGO's requests
- ✓ One NGO admin cannot approve requests outside their state
- ✓ A user cannot submit duplicate requests for same NGO
- ✓ Cross-NGO data leakage
- ✓ Unauthorized role assignments

---

## Database Relationships

```
User (1) ─────────── (Many) RolePreferenceRequest
         ├─ rolePreferenceRequests
         └─ approvedRoleRequests

NGO (1) ──────────── (Many) RolePreferenceRequest
        └─ rolePreferenceRequests
```

---

## Request Flow Diagram

```
1. User Signup
   ↓
POST /api/auth/signup-with-role-preference
   ├─ Create User
   ├─ Create RolePreferenceRequest (PENDING)
   └─ Return user and request details
   
2. NGO Admin Logs In
   ↓
POST /api/auth/regenerate-token
   └─ Get JWT token with ngoId and state
   
3. NGO Admin Views Requests
   ↓
GET /api/ngo/role-preference-requests?status=PENDING
   ├─ Verify JWT token
   ├─ Extract ngoId and state from token
   ├─ Query: WHERE ngoId = token.ngoId AND state = token.state
   └─ Return only matching requests
   
4a. NGO Admin Approves
   ↓
POST /api/ngo/role-preference-requests/[requestId]
   ├─ Verify request.ngoId === token.ngoId
   ├─ Verify request.state === token.state
   ├─ Update status to APPROVED
   ├─ Create UserRole entry
   └─ Return approval confirmation
   
4b. NGO Admin Rejects
   ↓
DELETE /api/ngo/role-preference-requests/[requestId]
   ├─ Same ownership verification
   ├─ Update status to REJECTED
   └─ Return rejection confirmation
```

---

## Testing Checklist

- [ ] Test user signup with valid data
- [ ] Test email already exists error (409)
- [ ] Test NGO not found error (404)
- [ ] Test state mismatch error (400)
- [ ] Test duplicate request prevention
- [ ] Test NGO admin views only their requests
- [ ] Test filtering by status (PENDING, APPROVED, REJECTED)
- [ ] Test approving request with new role
- [ ] Test rejecting request
- [ ] Test cross-NGO prevention (admin cannot approve other NGO's request)
- [ ] Test cross-state prevention
- [ ] Test token expiration handling
- [ ] Test missing token error (401)
- [ ] Test invalid token error (401)
- [ ] Test non-admin access denied (403)

---

## Environment Variables Required

```env
ACCESS_TOKEN_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## API Response Status Codes

| Endpoint | Method | Success | Error Codes |
|----------|--------|---------|------------|
| /api/auth/signup-with-role-preference | POST | 201 | 400, 404, 409, 500 |
| /api/ngo/role-preference-requests | GET | 200 | 401, 403, 500 |
| /api/ngo/role-preference-requests/[id] | POST | 200 | 400, 401, 403, 404, 500 |
| /api/ngo/role-preference-requests/[id] | DELETE | 200 | 400, 401, 403, 404, 500 |

---

## Documentation

Full API documentation available in: [ROLE_PREFERENCE_API_DOCS.md](ROLE_PREFERENCE_API_DOCS.md)

Includes:
- Complete endpoint specifications
- Request/response examples
- Error handling guide
- Usage examples
- Database schema reference
