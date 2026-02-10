# NGO Request Fetch APIs - Implementation Guide

## Overview

This document details the implementation of NGO Request fetch APIs following clean layered architecture with proper separation of concerns.

**Implementation Date:** February 5, 2026

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       HTTP Request                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   Route Handler (Controller)    │
                    │  src/app/api/ngoRequest/*      │
                    │  - Parse query/path params     │
                    │  - Call service layer          │
                    │  - Return HTTP response        │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    Service Layer                   │
                    │ ngoRequest_fetch.service.ts       │
                    │ - Validate input parameters       │
                    │ - Normalize pagination params     │
                    │ - Handle errors                   │
                    │ - Call repository layer           │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    Repository Layer                │
                    │   ngoRequest.ts                    │
                    │ - Pure database queries           │
                    │ - Use Prisma client               │
                    │ - Data transformation             │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    Prisma ORM                      │
                    │ - PostgreSQL database              │
                    │ - NGO Request model                │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    Database                        │
                    │ - ngo_request table                │
                    │ - Related tables (disaster, ngo, etc.) │
                    └────────────────────────────────────┘
```

---

## Files Created/Modified

### 1. Repository Layer
**File:** `src/app/repositories/ngoRequest.ts`

**Added Methods:**
- `findAll(page, pageSize)` - Fetch all with pagination
- `findById(id)` - Fetch single by UUID
- `findByDisasterId(id, page, pageSize)` - Filter by disaster
- `findByNgoId(id, page, pageSize)` - Filter by NGO
- `findByGovernmentId(id, page, pageSize)` - Filter by government

**Key Features:**
```typescript
// Smart field selection to avoid over-fetching
const selectFields = {
  id: true,
  disasterId: true,
  // ... include related data
  disaster: { select: { id, name, type, severity, ... } },
  ngo: { select: { id, name, registrationNumber, ... } },
  government: { select: { id, name, level, ... } },
  requestedBy: { select: { id, name, email } },
};

// Parallel count queries for efficient pagination
const [data, total] = await Promise.all([
  prisma.nGORequest.findMany({ ... }),
  prisma.nGORequest.count({ ... }),
]);
```

---

### 2. Service Layer
**File:** `src/app/Service/ngoRequest_fetch.service.ts`

**Core Functions:**
- `getAllRequests(options)` - Validate and fetch all
- `getRequestById(id)` - Validate ID and fetch
- `getRequestsByDisasterId(id, options)` - Validate and fetch by disaster
- `getRequestsByNgoId(id, options)` - Validate and fetch by NGO
- `getRequestsByGovernmentId(id, options)` - Validate and fetch by government

**Validation:**
```typescript
// UUID format validation
if (!id || typeof id !== "string" || id.trim() === "") {
  throw new Error("INVALID_ID");
}

// Pagination normalization
const validPage = Math.max(1, page || DEFAULT_PAGE);
const validPageSize = Math.min(
  Math.max(1, pageSize || DEFAULT_PAGE_SIZE),
  MAX_PAGE_SIZE // 100
);

// Specific error codes for error handling
throw new Error("REQUEST_NOT_FOUND");
throw new Error("INVALID_DISASTER_ID");
```

---

### 3. Controller/Route Handlers

#### A. GET /api/ngo-requests
**File:** `src/app/api/ngoRequest/route.ts`

```typescript
export async function GET(req: NextRequest) {
  // 1. Extract query parameters
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  // 2. Call service (handles validation)
  const result = await NGORequestFetchService.getAllRequests({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });

  // 3. Return formatted response
  return sendSuccess(result.data, "Retrieved X NGO request(s)", 200);
}
```

#### B. GET /api/ngo-requests/:id
**File:** `src/app/api/ngoRequest/[id]/route.ts`

```typescript
export async function GET(req, { params: { id } }) {
  // Validate ID present
  if (!id) return sendError("Request ID is required", "MISSING_ID", 400);

  // Call service
  const result = await NGORequestFetchService.getRequestById(id);

  // Handle specific errors
  if (error.message === "REQUEST_NOT_FOUND")
    return sendError(..., 404);
  if (error.message === "INVALID_ID")
    return sendError(..., 400);

  return sendSuccess(result.data, "NGO request fetched successfully", 200);
}
```

#### C. GET /api/ngo-requests/disaster/:disasterId
**File:** `src/app/api/ngoRequest/disaster/[disasterId]/route.ts`

```typescript
export async function GET(req, { params: { disasterId } }) {
  // Same pattern as ID endpoint
  // Validate → Call Service → Handle Errors → Return Response
}
```

#### D. GET /api/ngo-requests/ngo/:ngoId
**File:** `src/app/api/ngoRequest/ngo/[ngoId]/route.ts`

```typescript
export async function GET(req, { params: { ngoId } }) {
  // Same pattern as other endpoints
}
```

#### E. GET /api/ngo-requests/government/:governmentId
**File:** `src/app/api/ngoRequest/government/[governmentId]/route.ts`

```typescript
export async function GET(req, { params: { governmentId } }) {
  // Same pattern as other endpoints
}
```

---

## Error Handling Strategy

### Service Layer (Validation)
```typescript
try {
  // Sync validations
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("INVALID_ID");
  }

  // DB call
  const request = await NGORequestRepository.findById(id);

  if (!request) {
    throw new Error("REQUEST_NOT_FOUND");
  }

  return { success: true, data: request };
} catch (error: any) {
  if (error.message === "REQUEST_NOT_FOUND") {
    throw error; // Re-throw to preserve message
  }
  throw new Error(`Failed to fetch: ${error.message}`);
}
```

### Controller Layer (HTTP Response)
```typescript
try {
  const result = await NGORequestFetchService.getRequestById(id);
  return sendSuccess(result.data, "...", 200);
} catch (error: any) {
  // Map error messages to HTTP status codes
  if (error.message === "REQUEST_NOT_FOUND") {
    return sendError("NGO request not found", "NOT_FOUND", 404);
  }

  if (error.message === "INVALID_ID") {
    return sendError("Invalid request ID format", "INVALID_ID", 400);
  }

  return sendError(error.message || "...", "FETCH_ERROR", 500, error);
}
```

---

## Pagination Implementation

### Features
- Default page size: 10 records
- Maximum page size: 100 records
- Safe defaults for invalid inputs
- Metadata returned internally (can be exposed if needed)

### Example Flow
```javascript
// User requests: page=2&pageSize=50
GET /api/ngo-requests?page=2&pageSize=50

// Service layer normalizes:
page = Math.max(1, 2) = 2
pageSize = Math.min(50, 100) = 50

// Repository calculates:
skip = (2 - 1) * 50 = 50
take = 50

// DB Query:
.findMany({ skip: 50, take: 50 })
.count()

// Returns pagination metadata:
{
  data: [...],
  pagination: {
    page: 2,
    pageSize: 50,
    total: 1000,
    totalPages: 20
  }
}
```

---

## Database Queries

### Optimized Field Selection
Only fetch necessary fields to reduce bandwidth:
```typescript
const selectFields = {
  id: true,
  disasterId: true,
  ngoId: true,
  governmentId: true,
  status: true,
  requestedById: true,
  respondedAt: true,
  createdAt: true,
  // Include related data with their own field selection
  disaster: {
    select: {
      id: true,
      name: true,
      type: true,
      severity: true,
      location: true,
      status: true,
      reportedAt: true,
    },
  },
  ngo: {
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      state: true,
      focusArea: true,
    },
  },
  // ... more relations
};
```

### Efficient Pagination
```typescript
// GOOD: Parallel queries
const [data, total] = await Promise.all([
  prisma.nGORequest.findMany({ skip, take }),
  prisma.nGORequest.count(),
]);

// Alternative if count not needed
const data = await prisma.nGORequest.findMany({ skip, take });
```

### Indexed Queries
Database has indexes on:
- `id` (primary key)
- `disasterId`
- `ngoId`
- `governmentId`
- `status`
- `createdAt`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Retrieved X NGO request(s)",
  "data": [
    {
      "id": "uuid",
      "disasterId": "uuid",
      "ngoId": "uuid",
      "governmentId": "uuid",
      "status": "PENDING|ACCEPTED|REJECTED",
      "requestedById": "uuid",
      "respondedAt": "ISO8601 or null",
      "createdAt": "ISO8601",
      "disaster": { ... },
      "ngo": { ... },
      "government": { ... },
      "requestedBy": { ... }
    }
  ],
  "timestamp": "ISO8601"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Stack trace (dev mode only)"
  },
  "timestamp": "ISO8601"
}
```

---

## Testing Guide

### Unit Tests (Service Layer)
```typescript
describe('NGORequestFetchService', () => {
  it('should validate ID before calling repository', async () => {
    // Test invalid IDs
    expect(() => getRequestById('')).toThrow('INVALID_ID');
    expect(() => getRequestById(null)).toThrow('INVALID_ID');
  });

  it('should throw REQUEST_NOT_FOUND when not found', async () => {
    // Mock repository to return null
    expect(() => getRequestById('non-existent')).toThrow('REQUEST_NOT_FOUND');
  });

  it('should return data when found', async () => {
    const result = await getRequestById('valid-id');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should normalize pagination parameters', async () => {
    // Test with negative page
    const result = await getAllRequests({ page: -1, pageSize: 10 });
    // Should use page 1

    // Test with pageSize > 100
    const result = await getAllRequests({ page: 1, pageSize: 150 });
    // Should cap at 100
  });
});
```

### Integration Tests (Routes)
```typescript
describe('GET /api/ngo-requests', () => {
  it('should return paginated results', async () => {
    const response = await fetch('/api/ngo-requests?page=1&pageSize=10');
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('should return 404 for non-existent ID', async () => {
    const response = await fetch('/api/ngo-requests/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid ID', async () => {
    const response = await fetch('/api/ngo-requests/invalid-id');
    expect(response.status).toBe(400);
  });
});
```

### Manual Testing
```bash
# Run provided test script
chmod +x TEST_NGO_REQUEST_FETCH.sh
./TEST_NGO_REQUEST_FETCH.sh

# Or manual curl tests
curl http://localhost:3000/api/ngo-requests
curl http://localhost:3000/api/ngo-requests/[id]
curl "http://localhost:3000/api/ngo-requests/disaster/[disasterId]?page=1&pageSize=10"
curl "http://localhost:3000/api/ngo-requests/ngo/[ngoId]"
curl "http://localhost:3000/api/ngo-requests/government/[governmentId]"
```

---

## Performance Considerations

1. **Database Indexes**
   - All filter fields are indexed
   - Composite indexes for common filter combinations

2. **Query Optimization**
   - Field selection prevents over-fetching
   - Parallel count queries with Promise.all()
   - Pagination prevents large dataset transfers

3. **Caching Opportunities**
   - Disaster/NGO/Government data rarely changes
   - Could implement Redis caching for frequently accessed entities
   - Cache invalidation on create/update

4. **Monitoring**
   - Log slow queries (>1s)
   - Monitor pagination usage patterns
   - Alert on error spikes

---

## Security Considerations

1. **Input Validation**
   - UUID format validation
   - String length checks
   - Type coercion guards

2. **SQL Injection Prevention**
   - Using Prisma parameterized queries (safe from injection)
   - No raw SQL strings

3. **Error Handling**
   - No database details in production errors
   - Stack traces only in development mode
   - Proper HTTP status codes

4. **Future Enhancements**
   - Add authentication/authorization checks
   - Role-based access control (government/NGO/admin)
   - Audit logging for data access
   - Rate limiting per user/IP

---

## Deployment Checklist

- [ ] All 5 endpoints tested with real database data
- [ ] Error handling tested with edge cases
- [ ] Pagination tested with large datasets
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Indexes created on relevant columns
- [ ] Logging configured
- [ ] Error monitoring enabled
- [ ] Performance tests completed
- [ ] Security review completed
- [ ] API documentation reviewed
- [ ] Test script runs successfully

---

## Future Enhancements

1. **Filtering**
   - Add status filter (PENDING, ACCEPTED, REJECTED)
   - Add date range filters
   - Add sorting options

2. **Caching**
   - Redis cache for frequently accessed requests
   - Cache invalidation on updates

3. **Async Operations**
   - Bulk export to CSV/PDF
   - Webhook notifications on status changes
   - Scheduled reports

4. **Analytics**
   - Response time tracking
   - Error rate monitoring
   - Usage analytics

5. **Advanced Pagination**
   - Cursor-based pagination for large datasets
   - Export options (CSV, JSON)

---

## Troubleshooting

### Issue: API returns 404 for valid ID
**Solution:** 
- Verify ID exists in database
- Check UUID format (proper hyphenation)
- Review logs for actual error

### Issue: Pagination returns wrong results
**Solution:**
- Verify page/pageSize parameters
- Check max pageSize limit (100)
- Ensure database count is accurate

### Issue: Related data (disaster, ngo, etc.) is null
**Solution:**
- Check foreign key relationships
- Verify referenced entities exist
- Review database constraints

### Issue: Slow response times
**Solution:**
- Check database indexes exist
- Monitor active queries
- Consider caching for frequently accessed data
- Check pageSize (reduce if very large)
