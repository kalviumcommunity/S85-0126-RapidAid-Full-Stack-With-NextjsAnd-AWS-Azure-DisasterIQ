# NGO Request Fetch APIs - Architecture Diagrams

## 1. Overall Architecture Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                             │
│                                                                    │
│  GET /api/ngo-requests/:id?page=1&pageSize=10                   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     ROUTE HANDLER (Controller)                    │
│                   [src/app/api/ngoRequest/]                       │
│                                                                    │
│  1. Parse route params and query params                          │
│  2. Basic input validation (presence check)                      │
│  3. Call service layer                                           │
│  4. Map errors to HTTP status codes                              │
│  5. Return HTTP response                                         │
│                                                                    │
│  Key functions:                                                  │
│    - Extract params: params.id                                   │
│    - Get query: searchParams.get("page")                         │
│    - Call: NGORequestFetchService.getRequestById(id)            │
│    - Respond: sendSuccess() or sendError()                       │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                  │
│            [src/app/Service/ngoRequest_fetch.service.ts]         │
│                                                                    │
│  1. Validate input parameters                                    │
│    - UUID format validation                                      │
│    - Type checking                                               │
│    - Empty string detection                                      │
│                                                                    │
│  2. Normalize pagination parameters                              │
│    - Min page: 1                                                 │
│    - Default pageSize: 10                                        │
│    - Max pageSize: 100                                           │
│                                                                    │
│  3. Call repository layer                                        │
│  4. Handle and map errors                                        │
│  5. Return structured response                                   │
│                                                                    │
│  Key functions:                                                  │
│    - validatePaginationParams()                                  │
│    - getRequestById()                                            │
│    - getRequestsByDisasterId()                                   │
│    - getRequestsByNgoId()                                        │
│    - getRequestsByGovernmentId()                                 │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                                │
│              [src/app/repositories/ngoRequest.ts]                │
│                                                                    │
│  1. Execute database queries using Prisma                        │
│  2. Optimize field selection (prevent over-fetching)             │
│  3. Include related data (disaster, ngo, government, etc)       │
│  4. Handle pagination (skip, take)                               │
│  5. Parallel queries for count + data                            │
│                                                                    │
│  Key functions:                                                  │
│    - findAll(page, pageSize)                                     │
│    - findById(id)                                                │
│    - findByDisasterId(id, page, pageSize)                        │
│    - findByNgoId(id, page, pageSize)                             │
│    - findByGovernmentId(id, page, pageSize)                      │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     PRISMA ORM                                    │
│                                                                    │
│  - Parameterized queries (SQL injection safe)                    │
│  - TypeScript-aware (type-safe queries)                          │
│  - Connection pooling                                            │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                   PostgreSQL DATABASE                             │
│                                                                    │
│  Tables: ngo_request, disaster, ngo, government, user, etc      │
│  Indexes: disasterId, ngoId, governmentId, status, createdAt    │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                   RESPONSE BACK TO CLIENT                        │
│                                                                    │
│  HTTP 200 with JSON:                                             │
│  {                                                                │
│    "success": true,                                               │
│    "message": "...",                                              │
│    "data": [ { NGORequest }, ... ],                              │
│    "timestamp": "2026-02-05T10:15:30Z"                           │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Error Handling Flow

```
┌─────────────────┐
│   Controller    │
│   GET /api/:id  │
└────────┬────────┘
         │
         ▼
    ┌────────────────────────────────┐
    │ Validate params presence       │
    └────────────┬───────────────────┘
                 │
         ┌───────┴──────────┐
         │                  │
    Missing param       Param present
         │                  │
    Return 400          ▼
         │          ┌──────────────────────────┐
         │          │ Call Service Layer       │
         │          │ getRequestById(id)       │
         │          └────────┬─────────────────┘
         │                   │
         │           ┌───────┴──────────────────────┐
         │           │                              │
         │    ┌──────▼──────────┐         ┌────────▼─────────┐
         │    │ Service Layer   │         │ Service Layer    │
         │    │ Validation      │         │ Call Repository  │
         │    └────────┬────────┘         └────────┬─────────┘
         │             │                          │
         │     ┌───────┴──────────┐       ┌───────┴──────────────┐
         │     │                  │       │                      │
         │  Invalid ID        Valid ID    │              Query execution
         │     │                  │       │
         │  Error: INVALID_ID  ▼       ▼
         │     │          ┌──────────────────────┐
         │     │          │ findById()           │
         │     │          │ SELECT * FROM ...    │
         │     │          └────────┬─────────────┘
         │     │                   │
         │     │           ┌───────┴──────────┐
         │     │           │                  │
         │     │       Record found        Not found
         │     │           │                  │
         │     │        ▼                  Error: REQUEST_NOT_FOUND
         │     │      Return data             │
         │     │                              │
         │     └──────────────┬────────────────┘
         │                    │
         │            ┌───────▼────────────────┐
         │            │ Catch in Controller    │
         │            │ Error handler logic    │
         │            └───────┬────────────────┘
         │                    │
         │    ┌───────────────┼───────────────┐
         │    │               │               │
         │ INVALID_ID  REQUEST_NOT_FOUND   Other error
         │    │               │               │
         │  400            404              500
         │    │               │               │
         └────┴───────┬───────┴────────┬─────┘
                      │                │
                      ▼                ▼
            ┌──────────────────┐  ┌──────────────┐
            │ sendError()      │  │ sendError()  │
            │ HTTP Status      │  │ HTTP Status  │
            │ JSON Response    │  │ JSON Response│
            └──────────────────┘  └──────────────┘
                      │                │
                      └────────┬───────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Response to Client   │
                    │ {"success": false, ...│
                    └──────────────────────┘
```

---

## 3. Endpoint Routing Structure

```
/api/ngo-requests/
│
├── route.ts
│   └── GET /api/ngo-requests
│       ├── Query: ?page=1&pageSize=10
│       └── Calls: NGORequestFetchService.getAllRequests()
│
├── [id]/route.ts
│   └── GET /api/ngo-requests/:id
│       ├── Param: :id (UUID)
│       └── Calls: NGORequestFetchService.getRequestById(id)
│
├── disaster/[disasterId]/route.ts
│   └── GET /api/ngo-requests/disaster/:disasterId
│       ├── Param: :disasterId (UUID)
│       ├── Query: ?page=1&pageSize=10
│       └── Calls: NGORequestFetchService.getRequestsByDisasterId()
│
├── ngo/[ngoId]/route.ts
│   └── GET /api/ngo-requests/ngo/:ngoId
│       ├── Param: :ngoId (UUID)
│       ├── Query: ?page=1&pageSize=10
│       └── Calls: NGORequestFetchService.getRequestsByNgoId()
│
└── government/[governmentId]/route.ts
    └── GET /api/ngo-requests/government/:governmentId
        ├── Param: :governmentId (UUID)
        ├── Query: ?page=1&pageSize=10
        └── Calls: NGORequestFetchService.getRequestsByGovernmentId()
```

---

## 4. Data Flow for GET /api/ngo-requests/:id

```
User Request
    │
    │ GET /api/ngo-requests/123e4567-e89b-12d3-a456-426614174000
    │
    ▼
┌─────────────────────────────────────────┐
│ Route Handler: [id]/route.ts            │
│                                         │
│ function GET(req, { params: {id} })     │
├─────────────────────────────────────────┤
│ 1. if (!id) return sendError(400)       │
│ 2. const result = await              │
│    NGORequestFetchService.getRequestById(id)
│ 3. return sendSuccess(result.data)      │
│ catch (error) → map to HTTP status      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Service: ngoRequest_fetch.service.ts    │
│                                         │
│ getRequestById(id)                      │
├─────────────────────────────────────────┤
│ 1. Validate input:                      │
│    - !id → throw "INVALID_ID"          │
│    - typeof id !== "string" → error   │
│    - id.trim() === "" → error          │
│                                         │
│ 2. const request =                      │
│    await NGORequestRepository.findById()│
│                                         │
│ 3. Check result:                        │
│    if (!request) {                      │
│      throw "REQUEST_NOT_FOUND"         │
│    }                                    │
│                                         │
│ 4. return { success, data }             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Repository: ngoRequest.ts               │
│                                         │
│ findById(id)                            │
├─────────────────────────────────────────┤
│ return prisma.nGORequest.findUnique({   │
│   where: { id },                        │
│   select: {                             │
│     id: true,                           │
│     disasterId: true,                   │
│     ngoId: true,                        │
│     governmentId: true,                 │
│     status: true,                       │
│     createdAt: true,                    │
│     disaster: { select: {...} },        │
│     ngo: { select: {...} },             │
│     government: { select: {...} },      │
│     requestedBy: { select: {...} }      │
│   }                                     │
│ })                                      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Prisma ORM           │
        │ - Parameterized SQL  │
        │ - Connection pooling │
        │ - Query caching      │
        └──────────────┬───────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ PostgreSQL Database  │
            │ - SELECT * FROM      │
            │   ngo_request        │
            │   WHERE id = $1      │
            │ - JOIN relations     │
            └──────────────┬───────┘
                           │
                 ┌─────────┴──────────┐
                 │                    │
            Found record          Not found
                 │                    │
                 ▼                    ▼
         Return JSON           Return null
         ngo_request           (repository)
         with relations           │
                 │                 │
                 └────────┬────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │ Service Layer        │
                │ - Check result       │
                │ - Throw if not found │
                │ - Return if found    │
                └──────────────┬───────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Controller           │
                    │ - sendSuccess()      │
                    │ - or sendError()     │
                    └──────────────┬───────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ HTTP Response (200)  │
                        │                      │
                        │ {                    │
                        │   "success": true,   │
                        │   "message": "...",  │
                        │   "data": {          │
                        │     "id": "uuid",    │
                        │     "status": "...," │
                        │     "disaster": {...}│
                        │     ...              │
                        │   },                 │
                        │   "timestamp": "..." │
                        │ }                    │
                        └──────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Client receives JSON │
                        │ response with data   │
                        └──────────────────────┘
```

---

## 5. Pagination Flow

```
GET /api/ngo-requests?page=2&pageSize=20

Input from client: { page: "2", pageSize: "20" }
         │
         ▼
┌──────────────────────────────┐
│ Controller                   │
│ - searchParams.get("page")   │ → "2"
│ - searchParams.get("pageSize")│ → "20"
│ - Convert to numbers         │ → 2, 20
│ - Pass to service            │
└──────────────────┬───────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ Service: validatePaginationParams()  │
│                                      │
│ Input: { page: 2, pageSize: 20 }    │
├──────────────────────────────────────┤
│ 1. page = Math.max(1, 2) = 2         │
│ 2. pageSize = Math.min(20, 100) = 20 │
│ 3. Return: { page: 2, pageSize: 20 } │
│                                      │
│ Validation rules:                    │
│ - page < 1 → set to 1                │
│ - pageSize < 1 → set to 1            │
│ - pageSize > 100 → set to 100        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ Repository: findAll(page, pageSize)  │
│                                      │
│ Calculation:                         │
│ - skip = (page - 1) * pageSize       │
│ - skip = (2 - 1) * 20 = 20           │
│ - take = 20                          │
├──────────────────────────────────────┤
│ Parallel queries:                    │
│                                      │
│ Query 1: findMany({                  │
│   orderBy: { createdAt: "desc" },    │
│   skip: 20,                          │
│   take: 20                           │
│ }) → Returns records 21-40            │
│                                      │
│ Query 2: count() → Returns 1000      │
│                                      │
│ Result:                              │
│ {                                    │
│   data: [ ... 20 records ... ],      │
│   pagination: {                      │
│     page: 2,                         │
│     pageSize: 20,                    │
│     total: 1000,                     │
│     totalPages: 50                   │
│   }                                  │
│ }                                    │
└──────────────────┬───────────────────┘
                   │
                   ▼
         ┌──────────────────────┐
         │ Return to Controller │
         └──────────────┬───────┘
                        │
                        ▼
         ┌──────────────────────────┐
         │ HTTP 200 Response        │
         │ {                        │
         │   "success": true,       │
         │   "data": [ ...20... ],  │
         │   "timestamp": "..."     │
         │ }                        │
         └──────────────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Client receives     │
              │ page 2 of 50 pages  │
              │ (records 21-40)     │
              └─────────────────────┘
```

---

## 6. Request Parameters Mapping

```
┌───────────────────────────────────────────────────────────────┐
│ GET /api/ngo-requests/disaster/abc-def-123?page=2&pageSize=15 │
└───────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
        Path param    Path param      Query params
        (route)       (route)         (search)
            │               │               │
            ▼               ▼               ▼
    /ngo-requests/   /disaster/      ?page=2
    (base path)   (filter type)   &pageSize=15


Controller receives:
┌─────────────────────────────────────────┐
│ req.nextUrl.pathname:                   │
│ "/api/ngo-requests/disaster/abc-def-123"│
│                                          │
│ params: {                                │
│   disasterId: "abc-def-123"              │
│ }                                        │
│                                          │
│ req.nextUrl.search:                      │
│ "?page=2&pageSize=15"                    │
│                                          │
│ searchParams:                            │
│   page = "2"                             │
│   pageSize = "15"                        │
│                                          │
│ const { disasterId } = params            │
│ const page = searchParams.get("page")    │
│ const pageSize = searchParams.get("pageSize")
└─────────────────────────────────────────┘
            │
            ▼
Passed to service layer:
NGORequestFetchService.getRequestsByDisasterId(
  "abc-def-123",  // disasterId from params
  {
    page: 2,       // converted from string
    pageSize: 15   // converted from string
  }
)
```

---

## 7. Field Selection Optimization

```
Without field selection (Wasteful):
─────────────────────────────────
prisma.nGORequest.findMany()
Returns ALL fields from ngo_request table
+ ALL fields from related tables
= Large payload, slower queries

Query result: 
{
  id, disasterId, ngoId, governmentId, status, 
  requestedById, respondedAt, createdAt,
  [ALL user fields], [ALL disaster fields],
  [ALL ngo fields], [ALL government fields],
  ... unused data ...
}


With field selection (Optimized):
─────────────────────────────────
prisma.nGORequest.findMany({
  select: {
    id: true,
    disasterId: true,
    status: true,
    disaster: {
      select: { id, name, type, severity, ... }
    },
    ngo: {
      select: { id, name, registrationNumber, ... }
    },
    // Only needed fields!
  }
})

Query result (smaller):
{
  id, disasterId, status,
  disaster: { id, name, type, severity },
  ngo: { id, name, registrationNumber }
}

Benefits:
✓ Smaller JSON payload
✓ Faster database queries
✓ Reduced memory usage
✓ Better client performance
```

---

## 8. Layer Responsibilities

```
┌────────────────────────────────────────────────────────┐
│ CONTROLLER (Route Handler)                             │
├────────────────────────────────────────────────────────┤
│ Responsibility: HTTP Interface                          │
│                                                         │
│ ✓ Parse HTTP request (params, query, body)             │
│ ✓ Validate input presence                              │
│ ✓ Call service layer                                   │
│ ✓ Format HTTP response                                 │
│ ✓ Map status codes (200, 404, 400, 500)                │
│ ✓ Handle and log errors                                │
│                                                         │
│ ✗ Do NOT: query database directly                      │
│ ✗ Do NOT: validate data format                         │
│ ✗ Do NOT: implement business logic                     │
└────────────────────────────────────────────────────────┘
                        │
                        ↓ uses
                        │
┌────────────────────────────────────────────────────────┐
│ SERVICE (Business Logic)                               │
├────────────────────────────────────────────────────────┤
│ Responsibility: Business Rules & Validation            │
│                                                         │
│ ✓ Validate input parameters (format, type)             │
│ ✓ Normalize parameters (pagination defaults)           │
│ ✓ Implement business logic                             │
│ ✓ Call repository layer                                │
│ ✓ Handle errors from repository                        │
│ ✓ Throw specific, meaningful errors                    │
│                                                         │
│ ✗ Do NOT: handle HTTP requests/responses               │
│ ✗ Do NOT: query database directly                      │
│ ✗ Do NOT: access HTTP context (req, res)               │
└────────────────────────────────────────────────────────┘
                        │
                        ↓ uses
                        │
┌────────────────────────────────────────────────────────┐
│ REPOSITORY (Data Access)                               │
├────────────────────────────────────────────────────────┤
│ Responsibility: Database Queries                        │
│                                                         │
│ ✓ Execute database queries                             │
│ ✓ Optimize field selection                             │
│ ✓ Include related data                                 │
│ ✓ Handle pagination (skip, take)                       │
│ ✓ Format database results                              │
│                                                         │
│ ✗ Do NOT: validate input parameters                    │
│ ✗ Do NOT: implement business logic                     │
│ ✗ Do NOT: format HTTP responses                        │
│ ✗ Do NOT: handle HTTP requests                         │
└────────────────────────────────────────────────────────┘
                        │
                        ↓ uses
                        │
┌────────────────────────────────────────────────────────┐
│ PRISMA (ORM)                                           │
├────────────────────────────────────────────────────────┤
│ Responsibility: Query Execution                         │
│                                                         │
│ ✓ Build parameterized SQL                              │
│ ✓ Execute queries safely                               │
│ ✓ Manage connections                                   │
│ ✓ Transform results to TypeScript objects              │
└────────────────────────────────────────────────────────┘
                        │
                        ↓
                        │
┌────────────────────────────────────────────────────────┐
│ DATABASE                                               │
├────────────────────────────────────────────────────────┤
│ PostgreSQL tables, indexes, constraints                │
└────────────────────────────────────────────────────────┘
```

---

## 9. Error Response Status Codes

```
┌─────────────────────────────────────────────────┐
│ 200 OK                                          │
├─────────────────────────────────────────────────┤
│ Data found and returned successfully            │
│ All 5 endpoints when query succeeds             │
│ Example:                                        │
│ {                                               │
│   "success": true,                              │
│   "data": { ... },                              │
│   "message": "NGO request fetched successfully" │
│ }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 400 Bad Request                                 │
├─────────────────────────────────────────────────┤
│ Client sent invalid data                        │
│                                                 │
│ Cases:                                          │
│ - Missing path parameter: id, disasterId, etc  │
│ - Invalid UUID format                          │
│ - Negative page number                         │
│                                                 │
│ Example:                                        │
│ {                                               │
│   "success": false,                             │
│   "message": "Invalid request ID format",       │
│   "error": {                                    │
│     "code": "INVALID_ID"                        │
│   }                                             │
│ }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 404 Not Found                                   │
├─────────────────────────────────────────────────┤
│ Requested resource doesn't exist                │
│                                                 │
│ Cases:                                          │
│ - NGO request ID doesn't exist in DB            │
│ - Valid ID but no record found                  │
│                                                 │
│ Example:                                        │
│ {                                               │
│   "success": false,                             │
│   "message": "NGO request not found",           │
│   "error": {                                    │
│     "code": "NOT_FOUND"                         │
│   }                                             │
│ }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 500 Internal Server Error                       │
├─────────────────────────────────────────────────┤
│ Server-side error occurred                      │
│                                                 │
│ Cases:                                          │
│ - Database connection failed                    │
│ - Unexpected error in service/repo              │
│ - Unhandled exception                           │
│                                                 │
│ Example:                                        │
│ {                                               │
│   "success": false,                             │
│   "message": "Failed to fetch NGO request",    │
│   "error": {                                    │
│     "code": "FETCH_ERROR",                      │
│     "details": "Stack trace (dev only)"         │
│   }                                             │
│ }                                               │
└─────────────────────────────────────────────────┘
```

---

## 10. Data Relationships Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                      ngo_request                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)           ← Unique identifier                        │
│ disasterId (FK)   ──→ Disaster                              │
│ ngoId (FK)        ──→ NGO                                    │
│ governmentId (FK) ──→ Government                             │
│ requestedById (FK)──→ User (who made the request)           │
│ status            ← PENDING, ACCEPTED, REJECTED             │
│ createdAt         ← Timestamp of request creation           │
│ respondedAt       ← Timestamp of response (null if pending) │
└─────────────────────────────────────────────────────────────┘
         │              │            │              │
         ▼              ▼            ▼              ▼
    ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐
    │Disaster │  │  NGO    │  │Government│  │ User   │
    ├─────────┤  ├─────────┤  ├──────────┤  ├────────┤
    │id       │  │id       │  │id        │  │id      │
    │name     │  │name     │  │name      │  │name    │
    │type     │  │state    │  │state     │  │email   │
    │severity │  │focusArea│  │level     │  │phone   │
    │location │  │...      │  │...       │  │...     │
    │...      │  └─────────┘  └──────────┘  └────────┘
    └─────────┘


API Response includes all related data:

GET /api/ngo-requests/[id]

Response:
{
  "data": {
    "id": "uuid",
    "status": "PENDING",
    "createdAt": "2026-02-05T10:00:00Z",
    
    "disaster": {                    ← Nested relation
      "id": "uuid",
      "name": "Flood 2026",
      "type": "FLOOD",
      "severity": 8,
      ...
    },
    
    "ngo": {                         ← Nested relation
      "id": "uuid",
      "name": "Red Cross India",
      "state": "State A",
      ...
    },
    
    "government": {                  ← Nested relation
      "id": "uuid",
      "name": "State Government",
      "state": "State A",
      ...
    },
    
    "requestedBy": {                 ← Nested relation
      "id": "uuid",
      "name": "Officer Name",
      "email": "officer@gov.in"
    }
  }
}
```
