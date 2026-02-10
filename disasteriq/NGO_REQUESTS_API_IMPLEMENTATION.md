# NGO Requests Fetch API Implementation

## Overview
This document outlines the complete implementation of the API to fetch NGO requests by `governmentId` following the Repository → Service → Route architecture.

---

## 1. Repository Layer
**File:** [src/app/repositories/ngoRequest.repository.ts](src/app/repositories/ngoRequest.repository.ts#L92-L116)

### Function: `getGovernmentRequests(governmentId: string)`
Fetches all NGO requests created by a specific government, with related data included.

```typescript
export async function getGovernmentRequests(governmentId: string) {
  return prisma.nGORequest.findMany({
    where: { governmentId },
    orderBy: { createdAt: "desc" },
    include: {
      disaster: true,
      ngo: {
        select: {
          id: true,
          name: true,
          state: true,
          contactEmail: true,
        },
      },
      requestedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
```

**Features:**
- ✅ Uses `Prisma.findMany` with `governmentId` filter
- ✅ Includes related data: disaster, ngo, requestedBy
- ✅ Orders results by `createdAt` (latest first)
- ✅ Selects only necessary NGO fields (id, name, state, contactEmail)
- ✅ Selects only necessary requestedBy fields (id, name, email)

---

## 2. Service Layer
**File:** [src/app/Service/ngoRequest_service.ts](src/app/Service/ngoRequest_service.ts#L75-L77)

### Method: `NGORequestService.getGovernmentRequests(governmentId: string)`
Service layer wrapper that calls the repository method.

```typescript
export const NGORequestService = {
  // ... other methods ...

  // Government sees all their requests and NGO responses
  getGovernmentRequests: async (governmentId: string) => {
    return await getGovernmentRequests(governmentId);
  },

  // ... other methods ...
};
```

**Features:**
- ✅ Accepts governmentId parameter
- ✅ Calls repository method `getGovernmentRequests()`
- ✅ No business logic needed for this simple fetch
- ✅ Empty results handled cleanly by Prisma (returns empty array)

---

## 3. API Route Handler
**File:** [src/app/api/government/requests/route.ts](src/app/api/government/requests/route.ts)

### Endpoint: `GET /api/government/requests`

```typescript
import { NextRequest } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { sendSuccess, sendError } from "@/app/lib/responseHandler";
import { ERROR_CODES } from "@/app/lib/errorCodes";
import { apiHandler } from "@/app/lib/apiWrapper";
import { requireRole } from "@/app/middleware/requireRole";

export const GET = apiHandler(async (req: NextRequest & { user?: any }) => {
  // 🔐 ROLE CHECK - Only Government can view their requests
  const roleError = requireRole(req, ["GOVERNMENT_ADMIN"]);
  if (roleError) return roleError;

  try {
    const requests = await NGORequestService.getGovernmentRequests(req.user.governmentId);
    
    return sendSuccess(requests, "Government requests fetched successfully");
  } catch (err: any) {
    return sendError(
      err.message || "Failed to fetch government requests",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});
```

**Features:**
- ✅ Uses `apiHandler` wrapper for consistent error handling
- ✅ Enforces `GOVERNMENT_ADMIN` role via `requireRole` middleware
- ✅ Extracts `governmentId` from authenticated user context (`req.user.governmentId`)
- ✅ Returns structured JSON response using `sendSuccess`
- ✅ Error handling with proper HTTP status codes (500 for server errors)
- ✅ No business logic in route (all delegated to service layer)
- ✅ Descriptive success message

---

## 4. Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Government requests fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "disasterId": "550e8400-e29b-41d4-a716-446655440001",
      "ngoId": "550e8400-e29b-41d4-a716-446655440002",
      "governmentId": "550e8400-e29b-41d4-a716-446655440003",
      "status": "PENDING",
      "requestedById": "550e8400-e29b-41d4-a716-446655440004",
      "respondedAt": null,
      "createdAt": "2026-02-09T10:30:00.000Z",
      "disaster": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Flood 2026",
        "type": "FLOOD",
        "severity": 8,
        "location": "Karnataka",
        "status": "ACTIVE",
        "reportedAt": "2026-02-09T08:00:00.000Z",
        "governmentId": "550e8400-e29b-41d4-a716-446655440003",
        // ... additional disaster fields ...
      },
      "ngo": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Red Cross India",
        "state": "Karnataka",
        "contactEmail": "contact@redcross.org"
      },
      "requestedBy": {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "name": "Admin User",
        "email": "admin@govt.gov.in"
      }
    }
  ],
  "timestamp": "2026-02-09T10:35:00.000Z"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Failed to fetch government requests",
  "error": "INTERNAL_ERROR",
  "timestamp": "2026-02-09T10:35:00.000Z"
}
```

---

## 5. Usage Example

### Request
```bash
curl -X GET http://localhost:3000/api/government/requests \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json"
```

### Response
Returns array of NGORequest objects with all related data for the authenticated government admin.

---

## 6. Architecture Pattern Summary

| Layer | File | Function |
|-------|------|----------|
| **Repository** | `ngoRequest.repository.ts` | `getGovernmentRequests(governmentId)` |
| **Service** | `ngoRequest_service.ts` | `NGORequestService.getGovernmentRequests()` |
| **Route** | `Api/government/requests/route.ts` | `GET /api/government/requests` |

---

## 7. Key Features

✅ **Prisma Integration:** Uses `findMany` with proper filtering and includes  
✅ **Related Data:** Includes disaster, ngo, and requestedBy with optimized field selection  
✅ **Ordering:** Results sorted by `createdAt` descending (latest first)  
✅ **Authentication:** JWT-based auth via `apiHandler` wrapper  
✅ **Authorization:** Role-based access control (`GOVERNMENT_ADMIN` only)  
✅ **Error Handling:** Structured error responses with proper HTTP status codes  
✅ **Clean Architecture:** Clear separation of concerns (Repository → Service → Route)  
✅ **TypeScript:** Full type safety throughout  
✅ **Documentation:** Inline comments and this document  

---

## 8. Testing the API

### Fetch NGO Requests for a Government
```bash
curl -X GET http://localhost:3000/api/government/requests \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Expected Behavior
- ✅ Returns all NGO requests created by the authenticated government
- ✅ Includes disaster, ngo, and requestedBy details
- ✅ Results sorted by latest first
- ✅ Empty array if no requests found

---

## Notes

- The API follows the existing project patterns and conventions
- Uses utility functions for consistent response formatting (`sendSuccess`, `sendError`)
- Middleware handles authentication/authorization automatically
- No schema changes required
- Ready for production use
