# Role Preference Request API Documentation

## Overview

This system allows users to sign up and submit role preference requests for specific NGOs. NGO admins can then view, approve, and reject these requests. The system enforces strict security to prevent cross-NGO access.

## Security Features

✅ **NGO Isolation**: NGO admins only see requests from their own NGO and state
✅ **State-based Filtering**: Requests are filtered by both `ngoId` AND `state`
✅ **JWT Validation**: All admin endpoints require valid authentication tokens
✅ **Authorization Checks**: Prevents users from accessing other NGOs' data
✅ **Unique Constraints**: Users can only submit one request per NGO

---

## API Endpoints

### 1. User Signup with Role Preference Request

**Endpoint:** `POST /api/auth/signup-with-role-preference`

**Description:** Allows a new user to sign up and immediately submit a role preference request for a specific NGO.

**No Authentication Required** ✓

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "9876543210",
  "ngoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "state": "Maharashtra",
  "preferredRole": "MEDICAL_VOLUNTEER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully and role preference request submitted",
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "rolePreferenceRequest": {
    "id": "request-uuid",
    "status": "PENDING",
    "preferredRole": "MEDICAL_VOLUNTEER",
    "ngo": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Red Cross India",
      "state": "Maharashtra"
    },
    "createdAt": "2026-02-03T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields or state mismatch
- `404`: NGO not found
- `409`: Email already exists

---

### 2. NGO Admin: View Role Preference Requests

**Endpoint:** `GET /api/ngo/role-preference-requests`

**Description:** Fetch all role preference requests for the NGO admin's NGO and state.

**Authentication Required:** ✓ JWT Token in cookies or Authorization header

**Security:**
- Automatically filters by `ngoId` and `state` from JWT token
- Admin can only see requests for their NGO and state
- No way to access other NGOs' requests

**Query Parameters:**
```
GET /api/ngo/role-preference-requests?status=PENDING
```
- `status` (optional): `PENDING`, `APPROVED`, or `REJECTED`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Found 3 role preference request(s)",
  "ngoContext": {
    "ngoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "state": "Maharashtra",
    "userId": "admin-user-uuid"
  },
  "requests": [
    {
      "id": "request-uuid-1",
      "userId": "user-uuid-1",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "userPhone": "9876543210",
      "preferredRole": "MEDICAL_VOLUNTEER",
      "status": "PENDING",
      "approvedRole": null,
      "approvedAt": null,
      "approvedBy": null,
      "createdAt": "2026-02-03T10:30:00Z",
      "updatedAt": "2026-02-03T10:30:00Z"
    },
    {
      "id": "request-uuid-2",
      "userId": "user-uuid-2",
      "userName": "Jane Smith",
      "userEmail": "jane@example.com",
      "userPhone": "9123456789",
      "preferredRole": "RESCUE_VOLUNTEER",
      "status": "APPROVED",
      "approvedRole": "RESCUE_VOLUNTEER",
      "approvedAt": "2026-02-03T11:00:00Z",
      "approvedBy": "Admin User",
      "createdAt": "2026-02-03T09:00:00Z",
      "updatedAt": "2026-02-03T11:00:00Z"
    }
  ],
  "count": 3
}
```

**Error Responses:**
- `401`: Missing or invalid token
- `403`: User does not have NGO admin credentials

---

### 3. NGO Admin: Approve and Assign Role

**Endpoint:** `POST /api/ngo/role-preference-requests/[requestId]`

**Description:** Approve a role preference request and assign a final role to the user.

**Authentication Required:** ✓ JWT Token in cookies or Authorization header

**Security:**
- Verifies that the request belongs to the admin's NGO and state
- Prevents cross-NGO approvals
- Only allows approval of PENDING requests

**Request Body:**
```json
{
  "requestId": "request-uuid",
  "approvedRole": "MEDICAL_VOLUNTEER"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Role preference request approved and role assigned successfully",
  "approvedRequest": {
    "id": "request-uuid",
    "userId": "user-uuid",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "ngoName": "Red Cross India",
    "preferredRole": "MEDICAL_VOLUNTEER",
    "approvedRole": "MEDICAL_VOLUNTEER",
    "status": "APPROVED",
    "approvedAt": "2026-02-03T11:00:00Z",
    "roleAssigned": true
  }
}
```

**Error Responses:**
- `400`: Request is not in PENDING status or already processed
- `401`: Missing or invalid token
- `403`: Request does not belong to admin's NGO/state
- `404`: Request not found

---

### 4. NGO Admin: Reject Role Preference Request

**Endpoint:** `DELETE /api/ngo/role-preference-requests/[requestId]`

**Description:** Reject a role preference request from a user.

**Authentication Required:** ✓ JWT Token in cookies or Authorization header

**Security:**
- Verifies that the request belongs to the admin's NGO and state
- Prevents cross-NGO rejections

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Role preference request rejected successfully",
  "rejectedRequest": {
    "id": "request-uuid",
    "userId": "user-uuid",
    "userName": "John Doe",
    "status": "REJECTED"
  }
}
```

**Error Responses:**
- `400`: Request is not in PENDING status
- `401`: Missing or invalid token
- `403`: Request does not belong to admin's NGO/state
- `404`: Request not found

---

## Database Schema

### RolePreferenceRequest Table

```prisma
model RolePreferenceRequest {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  ngoId     String   @db.Uuid
  state     String
  preferredRole String
  status    RolePreferenceRequestStatus @default(PENDING)
  approvedRole String?
  approvedAt DateTime?
  approvedBy String? @db.Uuid
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ngo       NGO      @relation(fields: [ngoId], references: [id], onDelete: Cascade)
  approver  User?    @relation("ApprovedRoleRequests", fields: [approvedBy], references: [id])

  @@unique([userId, ngoId])
  @@index([ngoId])
  @@index([state])
  @@index([status])
  @@index([createdAt])
  @@index([ngoId, state])
  @@map("role_preference_request")
}

enum RolePreferenceRequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## Usage Examples

### Example 1: Complete User Flow

**Step 1: User Signs Up**
```bash
curl -X POST http://localhost:3000/api/auth/signup-with-role-preference \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "phone": "9876543210",
    "ngoId": "ngo-uuid",
    "state": "Maharashtra",
    "preferredRole": "RESCUE_VOLUNTEER"
  }'
```

**Step 2: NGO Admin Logs In & Gets Token**
```bash
curl -X POST http://localhost:3000/api/auth/regenerate-token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@redcross.com",
    "password": "AdminPass123!"
  }'
# Response includes: accessToken (stored in cookie)
```

**Step 3: NGO Admin Views Pending Requests**
```bash
curl -X GET http://localhost:3000/api/ngo/role-preference-requests?status=PENDING \
  -H "Cookie: accessToken=<token>"
```

**Step 4: NGO Admin Approves Request**
```bash
curl -X POST http://localhost:3000/api/ngo/role-preference-requests/request-uuid \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=<token>" \
  -d '{
    "requestId": "request-uuid",
    "approvedRole": "RESCUE_VOLUNTEER"
  }'
```

---

## Security Implementation Details

### 1. JWT Token Validation
- All admin endpoints verify the JWT token signature
- Token expiration is checked (15 minutes for access tokens)
- Invalid or expired tokens are rejected with 401 status

### 2. NGO and State Filtering
```typescript
// Database query automatically filters by ngoId AND state
const requests = await RolePreferenceRequestRepository.findByNgoAndState(
  ngoId,      // From JWT token
  state       // From JWT token
);
```

### 3. Ownership Verification
```typescript
// Before approving, verify request belongs to admin's NGO
if (request.ngoId !== approverNgoId || request.state !== approverState) {
  throw new Error("Unauthorized");
}
```

### 4. Unique Constraint
- Each user can have only one request per NGO
- Prevents duplicate submissions
- Enforced at database level with unique constraint

---

## Available Volunteer Roles

```
GROUND_VOLUNTEER
MEDICAL_VOLUNTEER
RESCUE_VOLUNTEER
RELIEF_VOLUNTEER
DATA_VOLUNTEER
COMMUNICATION_VOLUNTEER
VOLUNTEER_LEAD
```

---

## Status Flow

```
User Signup + Request Submission
         ↓
Request Status: PENDING
         ↓
NGO Admin Reviews
         ↓
     ✓ APPROVED        ✗ REJECTED
    (Role assigned)    (Denied)
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

---

## Notes

- Passwords are hashed using bcrypt
- Email addresses are sanitized and stored in lowercase
- All timestamps are in ISO 8601 format
- State matching is case-sensitive
- NGO ID must exist in the database for signup
