/**
 * NGO Request Fetch API - Type Definitions
 * 
 * Provides TypeScript interfaces and types for the fetch APIs
 */

/**
 * NGO Request Status
 */
export enum NGORequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

/**
 * Disaster object as returned in NGO Request responses
 */
export interface DisasterData {
  id: string;
  name: string;
  type: string;
  severity: number;
  location: string;
  status: string;
  reportedAt: string; // ISO8601
}

/**
 * NGO object as returned in NGO Request responses
 */
export interface NGOData {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  focusArea: string;
}

/**
 * Government object as returned in NGO Request responses
 */
export interface GovernmentData {
  id: string;
  name: string;
  level: string;
  state: string;
  department: string;
}

/**
 * User object as returned in NGO Request responses (requestedBy)
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
}

/**
 * Complete NGO Request object with all related data
 */
export interface NGORequest {
  id: string;
  disasterId: string;
  ngoId: string;
  governmentId: string;
  status: NGORequestStatus;
  requestedById: string;
  respondedAt: string | null; // ISO8601 or null
  createdAt: string; // ISO8601
  disaster: DisasterData;
  ngo: NGOData;
  government: GovernmentData;
  requestedBy: UserData;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Service options for fetch operations
 */
export interface FetchOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Service layer response format
 */
export interface ServiceResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMetadata;
}

/**
 * API success response
 */
export interface APISuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string; // ISO8601
}

/**
 * API error response
 */
export interface APIErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any; // Development mode only
  };
  timestamp: string; // ISO8601
}

/**
 * API response union type
 */
export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

/**
 * Repository response with pagination
 */
export interface RepositoryResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Query parameters for GET /api/ngo-requests
 */
export interface GetAllRequestsQuery {
  page?: string;
  pageSize?: string;
}

/**
 * Route params for GET /api/ngo-requests/:id
 */
export interface GetRequestByIdParams {
  id: string;
}

/**
 * Route params for GET /api/ngo-requests/disaster/:disasterId
 * Query params for pagination
 */
export interface GetRequestsByDisasterIdParams {
  disasterId: string;
}

export interface GetRequestsByDisasterIdQuery {
  page?: string;
  pageSize?: string;
}

/**
 * Route params for GET /api/ngo-requests/ngo/:ngoId
 * Query params for pagination
 */
export interface GetRequestsByNgoIdParams {
  ngoId: string;
}

export interface GetRequestsByNgoIdQuery {
  page?: string;
  pageSize?: string;
}

/**
 * Route params for GET /api/ngo-requests/government/:governmentId
 * Query params for pagination
 */
export interface GetRequestsByGovernmentIdParams {
  governmentId: string;
}

export interface GetRequestsByGovernmentIdQuery {
  page?: string;
  pageSize?: string;
}

/**
 * Error codes used in the API
 */
export enum APIErrorCode {
  // Validation errors (400)
  MISSING_ID = "MISSING_ID",
  INVALID_ID = "INVALID_ID",
  MISSING_DISASTER_ID = "MISSING_DISASTER_ID",
  INVALID_DISASTER_ID = "INVALID_DISASTER_ID",
  MISSING_NGO_ID = "MISSING_NGO_ID",
  INVALID_NGO_ID = "INVALID_NGO_ID",
  MISSING_GOVERNMENT_ID = "MISSING_GOVERNMENT_ID",
  INVALID_GOVERNMENT_ID = "INVALID_GOVERNMENT_ID",

  // Not found errors (404)
  NOT_FOUND = "NOT_FOUND",

  // Server errors (500)
  FETCH_ERROR = "FETCH_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

/**
 * Service error messages
 */
export enum ServiceErrorMessage {
  INVALID_ID = "INVALID_ID",
  REQUEST_NOT_FOUND = "REQUEST_NOT_FOUND",
  INVALID_DISASTER_ID = "INVALID_DISASTER_ID",
  INVALID_NGO_ID = "INVALID_NGO_ID",
  INVALID_GOVERNMENT_ID = "INVALID_GOVERNMENT_ID",
}

/**
 * Helper type for extracting data from API response
 */
export type APIResponseData<T> = T extends APISuccessResponse<infer U>
  ? U
  : never;

/**
 * Request counter metrics (optional for monitoring)
 */
export interface RequestMetrics {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}

/**
 * Disaster request summary (optional for dashboard)
 */
export interface DisasterRequestSummary {
  disasterId: string;
  disasterName: string;
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}

/**
 * NGO request summary (optional for dashboard)
 */
export interface NGORequestSummary {
  ngoId: string;
  ngoName: string;
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}
