# NGO Request Fetch APIs - Documentation

## Overview
Clean layered architecture for fetching NGO request records with proper separation of concerns.

**Architecture Flow:** Route → Controller → Service → Repository → Prisma

---

## Architecture Layers

### 1. **Repository Layer** (`src/app/repositories/ngoRequest.ts`)
- Direct database access using Prisma
- Pure data retrieval functions
- Pagination support with count queries
- Methods:
  - `findAll()` - Fetch all NGO requests
  - `findById()` - Fetch by ID
  - `findByDisasterId()` - Fetch by disaster
  - `findByNgoId()` - Fetch by NGO
  - `findByGovernmentId()` - Fetch by government

### 2. **Service Layer** (`src/app/Service/ngoRequest_fetch.service.ts`)
- Business logic and validation
- Input parameter validation
- Pagination parameter normalization
- Error handling
- Methods mirror repository methods with additional validation

### 3. **Controller Layer** (Route Handlers in `src/app/api/ngoRequest/*`)
- HTTP request/response handling
- Query parameter extraction
- Error response formatting
- Status code management
- 5 separate routes for different fetch scenarios

---

## API Endpoints

### 1. GET /api/ngo-requests
**Fetch all NGO requests with pagination**

**Request:**
```bash
curl -X GET "http://localhost:3000/api/ngo-requests?page=1&pageSize=10"
```

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| page | number | 1 | - | Page number (1-indexed) |
| pageSize | number | 10 | 100 | Records per page |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 10 NGO request(s)",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "disasterId": "disaster-uuid",
      "ngoId": "ngo-uuid",
      "governmentId": "gov-uuid",
      "status": "PENDING",
      "requestedById": "user-uuid",
      "respondedAt": null,
      "createdAt": "2026-02-05T10:00:00Z",
      "disaster": {
        "id": "disaster-uuid",
        "name": "Flood 2026",
        "type": "FLOOD",
        "severity": 8,
        "location": "State A, District B",
        "status": "ONGOING",
        "reportedAt": "2026-02-05T08:00:00Z"
      },
      "ngo": {
        "id": "ngo-uuid",
        "name": "Red Cross India",
        "registrationNumber": "REG123",
        "state": "State A",
        "focusArea": "Emergency Relief"
      },
      "government": {
        "id": "gov-uuid",
        "name": "State Government",
        "level": "STATE",
        "state": "State A",
        "department": "Disaster Management"
      },
      "requestedBy": {
        "id": "user-uuid",
        "name": "Officer Name",
        "email": "officer@gov.in"
      }
    }
  ],
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

**Error Responses:**
- `500` - Internal server error

---

### 2. GET /api/ngo-requests/:id
**Fetch NGO request by ID**

**Request:**
```bash
curl -X GET "http://localhost:3000/api/ngo-requests/123e4567-e89b-12d3-a456-426614174000"
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | NGO request UUID |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "NGO request fetched successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "disasterId": "disaster-uuid",
    "ngoId": "ngo-uuid",
    "governmentId": "gov-uuid",
    "status": "PENDING",
    "requestedById": "user-uuid",
    "respondedAt": null,
    "createdAt": "2026-02-05T10:00:00Z",
    "disaster": { /* ... */ },
    "ngo": { /* ... */ },
    "government": { /* ... */ },
    "requestedBy": { /* ... */ }
  },
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | MISSING_ID | Request ID is required |
| 400 | INVALID_ID | Invalid request ID format |
| 404 | NOT_FOUND | NGO request not found |
| 500 | FETCH_ERROR | Failed to fetch NGO request |

---

### 3. GET /api/ngo-requests/disaster/:disasterId
**Fetch all NGO requests for a specific disaster**

**Request:**
```bash
curl -X GET "http://localhost:3000/api/ngo-requests/disaster/disaster-uuid?page=1&pageSize=20"
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| disasterId | string | Disaster UUID |

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| pageSize | number | 10 | 100 |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 5 NGO request(s) for disaster",
  "data": [
    { /* NGO request objects */ }
  ],
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | MISSING_DISASTER_ID | Disaster ID is required |
| 400 | INVALID_DISASTER_ID | Invalid disaster ID format |
| 500 | FETCH_ERROR | Failed to fetch requests |

---

### 4. GET /api/ngo-requests/ngo/:ngoId
**Fetch all NGO requests for a specific NGO**

**Request:**
```bash
curl -X GET "http://localhost:3000/api/ngo-requests/ngo/ngo-uuid?page=1&pageSize=20"
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| ngoId | string | NGO UUID |

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| pageSize | number | 10 | 100 |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 3 NGO request(s) for NGO",
  "data": [
    { /* NGO request objects */ }
  ],
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | MISSING_NGO_ID | NGO ID is required |
| 400 | INVALID_NGO_ID | Invalid NGO ID format |
| 500 | FETCH_ERROR | Failed to fetch requests |

---

### 5. GET /api/ngo-requests/government/:governmentId
**Fetch all NGO requests for a specific government**

**Request:**
```bash
curl -X GET "http://localhost:3000/api/ngo-requests/government/gov-uuid?page=1&pageSize=20"
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| governmentId | string | Government UUID |

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| page | number | 1 | - |
| pageSize | number | 10 | 100 |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 8 NGO request(s) for government",
  "data": [
    { /* NGO request objects */ }
  ],
  "timestamp": "2026-02-05T10:15:30.123Z"
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | MISSING_GOVERNMENT_ID | Government ID is required |
| 400 | INVALID_GOVERNMENT_ID | Invalid government ID format |
| 500 | FETCH_ERROR | Failed to fetch requests |

---

## Data Response Structure

All successful responses return:
```json
{
  "success": true,
  "message": "...",
  "data": [...],
  "timestamp": "ISO8601"
}
```

All error responses return:
```json
{
  "success": false,
  "message": "...",
  "error": {
    "code": "ERROR_CODE",
    "details": "Development only"
  },
  "timestamp": "ISO8601"
}
```

---

## Pagination

All list endpoints support pagination:

```javascript
// Default behavior
GET /api/ngo-requests
// Returns: page 1, 10 items per page

// Custom pagination
GET /api/ngo-requests?page=2&pageSize=20
// Returns: page 2, 20 items per page

// Maximum page size is 100
GET /api/ngo-requests?pageSize=150
// Returns: page 1, 100 items per page (limited)
```

Pagination metadata is NOT in main response body (left out for brevity in examples), but service supports it internally.

---

## Error Handling

The APIs use consistent error handling:

1. **Input Validation** (Service Layer)
   - Empty/null checks
   - Type validation
   - Format validation

2. **Database Errors** (Repository Layer)
   - Database connection errors
   - Query failures

3. **HTTP Response**
   - Appropriate status codes
   - Structured error object with code
   - Descriptive messages

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Fetch all requests
const response = await fetch('/api/ngo-requests?page=1&pageSize=10');
const json = await response.json();
console.log(json.data);

// Fetch by ID
const response = await fetch('/api/ngo-requests/123e4567-e89b-12d3-a456-426614174000');
const json = await response.json();
console.log(json.data);

// Fetch by disaster
const response = await fetch('/api/ngo-requests/disaster/disaster-uuid?page=1');
const json = await response.json();
console.log(json.data);

// Fetch by NGO
const response = await fetch('/api/ngo-requests/ngo/ngo-uuid?page=1');
const json = await response.json();
console.log(json.data);

// Fetch by government
const response = await fetch('/api/ngo-requests/government/gov-uuid?page=1');
const json = await response.json();
console.log(json.data);
```

### cURL

```bash
# Fetch all
curl http://localhost:3000/api/ngo-requests?page=1&pageSize=10

# Fetch by ID
curl http://localhost:3000/api/ngo-requests/123e4567-e89b-12d3-a456-426614174000

# Fetch by disaster
curl http://localhost:3000/api/ngo-requests/disaster/disaster-uuid

# Fetch by NGO
curl http://localhost:3000/api/ngo-requests/ngo/ngo-uuid

# Fetch by government
curl http://localhost:3000/api/ngo-requests/government/gov-uuid
```

---

## File Structure

```
src/app/
├── repositories/
│   └── ngoRequest.ts              (Repository Layer)
├── Service/
│   └── ngoRequest_fetch.service.ts (Service Layer)
└── Api/
    └── ngoRequest/
        ├── route.ts                           (GET /api/ngo-requests)
        ├── [id]/
        │   └── route.ts                       (GET /api/ngo-requests/:id)
        ├── disaster/
        │   └── [disasterId]/
        │       └── route.ts                   (GET /api/ngo-requests/disaster/:disasterId)
        ├── ngo/
        │   └── [ngoId]/
        │       └── route.ts                   (GET /api/ngo-requests/ngo/:ngoId)
        └── government/
            └── [governmentId]/
                └── route.ts                   (GET /api/ngo-requests/government/:governmentId)
```

---

## Implementation Notes

1. **Separation of Concerns**
   - Each layer has single responsibility
   - Controllers don't access Prisma directly
   - Services don't handle HTTP responses
   - Repositories handle only database operations

2. **Error Handling**
   - Synchronous validation in service
   - Async database errors caught in controllers
   - Consistent error format

3. **Pagination**
   - Service validates page and pageSize
   - Max pageSize is 100 to prevent abuse
   - Returns data + pagination metadata

4. **Performance**
   - Uses Prisma `select` to fetch only needed fields
   - Parallel count queries for pagination
   - Database indexes on frequently queried fields

5. **Security**
   - Input validation at service layer
   - Proper error messages (no SQL leakage)
   - UUID format validation
