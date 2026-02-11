# NGO Request Fetch APIs - Project Summary

**Implementation Date:** February 5, 2026  
**Architecture:** Clean Layered Architecture with Separation of Concerns  
**Framework:** Next.js with Express-like Routing  
**ORM:** Prisma

---

## 🎯 Project Overview

Implemented 5 GET endpoints for fetching NGO Request records following a **clean layered architecture**:

```
Controller (Route Handlers) → Service Layer → Repository Layer → Prisma → Database
```

Each layer has a single responsibility, making the code:
- ✅ Maintainable
- ✅ Testable
- ✅ Scalable
- ✅ Reusable

---

## 📋 Implemented Endpoints

| # | Endpoint | Purpose | File |
|---|----------|---------|------|
| 1 | `GET /api/ngo-requests` | Fetch all with pagination | `route.ts` |
| 2 | `GET /api/ngo-requests/:id` | Fetch by request ID | `[id]/route.ts` |
| 3 | `GET /api/ngo-requests/disaster/:disasterId` | Fetch by disaster | `disaster/[disasterId]/route.ts` |
| 4 | `GET /api/ngo-requests/ngo/:ngoId` | Fetch by NGO | `ngo/[ngoId]/route.ts` |
| 5 | `GET /api/ngo-requests/government/:governmentId` | Fetch by government | `government/[governmentId]/route.ts` |

---

## 📁 File Structure

```
disasteriq/
├── src/app/
│   ├── repositories/
│   │   └── ngoRequest.ts                          ← REPOSITORY LAYER
│   │       ├── findAll()
│   │       ├── findById()
│   │       ├── findByDisasterId()
│   │       ├── findByNgoId()
│   │       └── findByGovernmentId()
│   │
│   ├── Service/
│   │   └── ngoRequest_fetch.service.ts            ← SERVICE LAYER
│   │       ├── getAllRequests()
│   │       ├── getRequestById()
│   │       ├── getRequestsByDisasterId()
│   │       ├── getRequestsByNgoId()
│   │       └── getRequestsByGovernmentId()
│   │
│   └── Api/ngoRequest/
│       ├── route.ts                               ← CONTROLLER (GET all)
│       ├── [id]/route.ts                          ← CONTROLLER (GET by ID)
│       ├── disaster/[disasterId]/route.ts         ← CONTROLLER (GET by disaster)
│       ├── ngo/[ngoId]/route.ts                   ← CONTROLLER (GET by NGO)
│       └── government/[governmentId]/route.ts     ← CONTROLLER (GET by government)
│
├── NGO_REQUEST_FETCH_API_DOCS.md                  ← API Documentation
├── NGO_REQUEST_FETCH_IMPLEMENTATION.md            ← Implementation Guide
└── TEST_NGO_REQUEST_FETCH.sh                      ← Test Script
```

---

## 🏗️ Architecture Layers

### 1️⃣ Repository Layer (`ngoRequest.ts`)
**Database access layer using Prisma**

```typescript
// Pure data retrieval with optimized field selection
export const NGORequestRepository = {
  findAll: async (page, pageSize) => {
    const [data, total] = await Promise.all([
      prisma.nGORequest.findMany({
        select: selectFields, // Smart field selection
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.nGORequest.count(),
    ]);
    return { data, pagination: { ... } };
  },
  // ... other methods
};
```

**Key Features:**
- ✅ Optimized field selection (no over-fetching)
- ✅ Efficient pagination with parallel queries
- ✅ Related data with their own field selection
- ✅ Database indexed queries

---

### 2️⃣ Service Layer (`ngoRequest_fetch.service.ts`)
**Business logic and input validation**

```typescript
export const NGORequestFetchService = {
  getAllRequests: async (options) => {
    // 1. Validate pagination parameters
    const { page, pageSize } = validatePaginationParams(
      options.page,
      options.pageSize
    );
    
    // 2. Call repository
    const result = await NGORequestRepository.findAll(page, pageSize);
    
    // 3. Return structured response
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  },
  
  getRequestById: async (id) => {
    // 1. Validate input
    if (!id || typeof id !== "string" || id.trim() === "") {
      throw new Error("INVALID_ID");
    }
    
    // 2. Call repository
    const request = await NGORequestRepository.findById(id);
    
    // 3. Check result
    if (!request) {
      throw new Error("REQUEST_NOT_FOUND");
    }
    
    return { success: true, data: request };
  },
  // ... other methods
};
```

**Key Features:**
- ✅ Input validation (UUIDs, empty strings, types)
- ✅ Pagination parameter normalization
- ✅ Descriptive error codes
- ✅ Consistent return format

---

### 3️⃣ Controller/Route Handler Layer
**HTTP request/response handling**

```typescript
// Example: GET /api/ngo-requests/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validate input
    if (!id) {
      return sendError("Request ID is required", "MISSING_ID", 400);
    }

    // 2. Call service
    const result = await NGORequestFetchService.getRequestById(id);

    // 3. Return success response
    return sendSuccess(result.data, "NGO request fetched successfully", 200);
  } catch (error: any) {
    // 4. Handle specific errors
    if (error.message === "REQUEST_NOT_FOUND") {
      return sendError("NGO request not found", "NOT_FOUND", 404);
    }

    if (error.message === "INVALID_ID") {
      return sendError("Invalid request ID format", "INVALID_ID", 400);
    }

    // 5. Generic error response
    return sendError(
      error.message || "Failed to fetch NGO request",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
```

**Key Features:**
- ✅ Clear separation of concerns
- ✅ Proper HTTP status codes
- ✅ Structured error responses
- ✅ Console logging for debugging

---

## 🔍 Error Handling

### Error Flow
```
Controller validates presence
    ↓
Service validates format/type
    ↓
Repository executes query
    ↓
Controller maps errors to HTTP status
    ↓
Client receives structured error response
```

### Error Codes
| Status | Code | Message | When |
|--------|------|---------|------|
| 400 | MISSING_ID | "Request ID is required" | Path param missing |
| 400 | INVALID_ID | "Invalid request ID format" | Invalid UUID |
| 400 | INVALID_DISASTER_ID | "Invalid disaster ID format" | Invalid UUID |
| 404 | NOT_FOUND | "NGO request not found" | No matching record |
| 500 | FETCH_ERROR | "Failed to fetch..." | DB/system error |

---

## 📊 Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Retrieved 5 NGO request(s)",
  "data": [
    {
      "id": "uuid",
      "disasterId": "uuid",
      "ngoId": "uuid",
      "governmentId": "uuid",
      "status": "PENDING",
      "requestedById": "uuid",
      "respondedAt": null,
      "createdAt": "2026-02-05T10:00:00Z",
      "disaster": { "id", "name", "type", "severity", ... },
      "ngo": { "id", "name", "registrationNumber", "state", ... },
      "government": { "id", "name", "level", "state", ... },
      "requestedBy": { "id", "name", "email" }
    }
  ],
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

### Error Response (400/404/500)
```json
{
  "success": false,
  "message": "NGO request not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "Development mode only"
  },
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

---

## 🔄 Pagination

All list endpoints support pagination:

```bash
# Default: page 1, size 10
GET /api/ngo-requests

# Custom pagination
GET /api/ngo-requests?page=2&pageSize=20

# Maximum pageSize is 100
GET /api/ngo-requests?pageSize=150  # Capped at 100
```

**Features:**
- ✅ Default page: 1
- ✅ Default size: 10
- ✅ Maximum size: 100 (prevents abuse)
- ✅ Safe normalization of invalid inputs

---

## 🧪 Testing

### Run All Tests
```bash
chmod +x TEST_NGO_REQUEST_FETCH.sh
./TEST_NGO_REQUEST_FETCH.sh
```

### Manual cURL Tests
```bash
# Test 1: Fetch all
curl http://localhost:3000/api/ngo-requests?page=1&pageSize=10

# Test 2: Fetch by ID
curl http://localhost:3000/api/ngo-requests/[UUID]

# Test 3: Fetch by disaster
curl http://localhost:3000/api/ngo-requests/disaster/[UUID]

# Test 4: Fetch by NGO
curl http://localhost:3000/api/ngo-requests/ngo/[UUID]

# Test 5: Fetch by government
curl http://localhost:3000/api/ngo-requests/government/[UUID]

# Test error case
curl http://localhost:3000/api/ngo-requests/invalid-id
```

### Unit Test Template
```typescript
describe('NGORequestFetchService', () => {
  it('should validate ID format', () => {
    expect(() => getRequestById('')).toThrow('INVALID_ID');
  });

  it('should throw on not found', async () => {
    expect(() => getRequestById('non-existent')).toThrow('REQUEST_NOT_FOUND');
  });

  it('should normalize pagination params', () => {
    // page -1 → 1, pageSize 150 → 100
  });
});
```

---

## 📚 Documentation Files

### 1. NGO_REQUEST_FETCH_API_DOCS.md
**Complete API Reference**
- Endpoint specifications
- Request/response examples
- Error codes and status codes
- Usage examples (JavaScript, cURL)
- Data structure reference

### 2. NGO_REQUEST_FETCH_IMPLEMENTATION.md
**Developer Guide**
- Architecture overview with diagrams
- File structure and responsibilities
- Implementation details for each layer
- Error handling strategy
- Performance considerations
- Security considerations
- Deployment checklist
- Troubleshooting guide

### 3. TEST_NGO_REQUEST_FETCH.sh
**Automated Test Script**
- Tests all 5 endpoints
- Error case testing
- Pagination testing
- Color-coded output
- Detailed logging

---

## ⚡ Key Features

### ✅ Clean Architecture
- Single responsibility per layer
- No cross-layer logic leakage
- Easy to test each layer independently

### ✅ Error Handling
- Specific error codes for each case
- Proper HTTP status codes
- Safe error messages (no SQL/stack traces in production)

### ✅ Input Validation
- UUID format validation
- Type checking
- Empty string detection
- Safe type coercion

### ✅ Pagination
- Prevents large dataset transfers
- Configurable page size (max 100)
- Safe defaults for invalid inputs

### ✅ Performance
- Optimized field selection
- Database indexes on filter fields
- Parallel count queries
- Efficient data fetching

### ✅ Documentation
- Comprehensive API docs
- Implementation guide
- Testing scripts
- Code comments

---

## 🚀 Quick Start

### 1. View API Documentation
```bash
cat NGO_REQUEST_FETCH_API_DOCS.md
```

### 2. Run Tests
```bash
chmod +x TEST_NGO_REQUEST_FETCH.sh
./TEST_NGO_REQUEST_FETCH.sh
```

### 3. Try Endpoints
```bash
curl http://localhost:3000/api/ngo-requests
curl http://localhost:3000/api/ngo-requests/[id]
curl http://localhost:3000/api/ngo-requests/disaster/[id]
curl http://localhost:3000/api/ngo-requests/ngo/[id]
curl http://localhost:3000/api/ngo-requests/government/[id]
```

### 4. Read Implementation Details
```bash
cat NGO_REQUEST_FETCH_IMPLEMENTATION.md
```

---

## 📋 Checklist

- ✅ Repository layer with 5 fetch methods
- ✅ Service layer with validation
- ✅ 5 route handlers (controllers)
- ✅ Proper error handling
- ✅ Pagination support
- ✅ Input validation
- ✅ Optimized queries
- ✅ API documentation
- ✅ Implementation guide
- ✅ Test script
- ✅ Code comments

---

## 🔐 Security

- ✅ Input validation (UUID format, empty strings)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ Safe error messages (no DB details exposed)
- ✅ Stack traces in development only
- ✅ Proper HTTP status codes

---

## 🎓 Learning Resources

**Architecture Patterns:**
- Layered architecture / N-tier architecture
- Service layer pattern
- Repository pattern
- Error handling patterns

**Technologies Used:**
- Next.js (routing)
- Prisma (ORM)
- PostgreSQL (database)
- TypeScript (type safety)

---

## 📞 Support

For issues or questions:
1. Check `NGO_REQUEST_FETCH_IMPLEMENTATION.md` troubleshooting section
2. Review API documentation in `NGO_REQUEST_FETCH_API_DOCS.md`
3. Run test script: `./TEST_NGO_REQUEST_FETCH.sh`
4. Check console logs for error messages

---

## 📝 Notes

- All endpoints follow the same architecture pattern
- Code is production-ready with proper error handling
- Pagination is implemented with safety limits
- Database queries are optimized with field selection
- Error messages are user-friendly yet informative

---

**Created:** February 5, 2026  
**Status:** ✅ Complete and Ready for Use
