/**
 * NGORequest Fetch Service
 * 
 * Business logic layer for fetching NGO request records
 * Handles validation, pagination, and data transformation
 * 
 * Architecture: Controller → Service → Repository → Prisma
 */

import { NGORequestRepository } from "@/app/repositories/ngoRequest";

interface FetchOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Validates and applies default values to pagination parameters
 */
const validatePaginationParams = (page?: number, pageSize?: number) => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const MAX_PAGE_SIZE = 100;

  const validPage = Math.max(1, page || DEFAULT_PAGE);
  const validPageSize = Math.min(
    Math.max(1, pageSize || DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  return { page: validPage, pageSize: validPageSize };
};

export const NGORequestFetchService = {
  /**
   * Fetch all NGO requests with pagination
   * @throws Error if invalid pagination parameters
   */
  getAllRequests: async (options: FetchOptions = {}) => {
    try {
      const { page, pageSize } = validatePaginationParams(
        options.page,
        options.pageSize
      );

      const result = await NGORequestRepository.findAll(page, pageSize);

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch all requests: ${error.message}`);
    }
  },

  /**
   * Fetch NGO request by ID
   * @throws Error if request not found
   */
  getRequestById: async (id: string) => {
    try {
      if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error("INVALID_ID");
      }

      const request = await NGORequestRepository.findById(id);

      if (!request) {
        throw new Error("REQUEST_NOT_FOUND");
      }

      return {
        success: true,
        data: request,
      };
    } catch (error: any) {
      if (error.message === "REQUEST_NOT_FOUND") {
        throw error;
      }
      throw new Error(`Failed to fetch request by ID: ${error.message}`);
    }
  },

  /**
   * Fetch all NGO requests for a specific disaster
   * @throws Error if disaster ID is invalid
   */
  getRequestsByDisasterId: async (disasterId: string, options: FetchOptions = {}) => {
    try {
      if (!disasterId || typeof disasterId !== "string" || disasterId.trim() === "") {
        throw new Error("INVALID_DISASTER_ID");
      }

      const { page, pageSize } = validatePaginationParams(
        options.page,
        options.pageSize
      );

      const result = await NGORequestRepository.findByDisasterId(
        disasterId,
        page,
        pageSize
      );

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error: any) {
      if (error.message === "INVALID_DISASTER_ID") {
        throw error;
      }
      throw new Error(`Failed to fetch requests by disaster: ${error.message}`);
    }
  },

  /**
   * Fetch all NGO requests for a specific NGO
   * @throws Error if NGO ID is invalid
   */
  getRequestsByNgoId: async (ngoId: string, options: FetchOptions = {}) => {
    try {
      if (!ngoId || typeof ngoId !== "string" || ngoId.trim() === "") {
        throw new Error("INVALID_NGO_ID");
      }

      const { page, pageSize } = validatePaginationParams(
        options.page,
        options.pageSize
      );

      const result = await NGORequestRepository.findByNgoId(
        ngoId,
        page,
        pageSize
      );

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error: any) {
      if (error.message === "INVALID_NGO_ID") {
        throw error;
      }
      throw new Error(`Failed to fetch requests by NGO: ${error.message}`);
    }
  },

  /**
   * Fetch all NGO requests for a specific government
   * @throws Error if government ID is invalid
   */
  getRequestsByGovernmentId: async (governmentId: string, options: FetchOptions = {}) => {
    try {
      if (!governmentId || typeof governmentId !== "string" || governmentId.trim() === "") {
        throw new Error("INVALID_GOVERNMENT_ID");
      }

      const { page, pageSize } = validatePaginationParams(
        options.page,
        options.pageSize
      );

      const result = await NGORequestRepository.findByGovernmentId(
        governmentId,
        page,
        pageSize
      );

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error: any) {
      if (error.message === "INVALID_GOVERNMENT_ID") {
        throw error;
      }
      throw new Error(`Failed to fetch requests by government: ${error.message}`);
    }
  },
};
