import { NGORequestRepository } from "@/app/repositories/ngoRequest";

interface FetchOptions {
  page?: number;
  pageSize?: number;
}

const validatePaginationParams = (page?: number, pageSize?: number) => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const MAX_PAGE_SIZE = 100;

  const validPage = Math.max(1, page ?? DEFAULT_PAGE);
  const validPageSize = Math.min(
    Math.max(1, pageSize ?? DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  return { page: validPage, pageSize: validPageSize };
};

export const NGORequestFetchService = {
  /**
   * Fetch all NGO requests (ADMIN use)
   */
  getAllRequests: async (options: FetchOptions = {}) => {
    const { page, pageSize } = validatePaginationParams(
      options.page,
      options.pageSize
    );

    return NGORequestRepository.findAll(page, pageSize);
  },

  /**
   * Fetch NGO request by ID
   */
  getRequestById: async (id: string) => {
    if (!id || typeof id !== "string") {
      throw new Error("INVALID_ID");
    }

    const request = await NGORequestRepository.findById(id);

    if (!request) {
      throw new Error("REQUEST_NOT_FOUND");
    }

    return request;
  },

  /**
   * Fetch NGO requests by NGO ID (JWT-driven)
   */
  getRequestsByNgoId: async (ngoId: string, options: FetchOptions = {}) => {
    if (!ngoId || typeof ngoId !== "string") {
      throw new Error("INVALID_NGO_ID");
    }

    const { page, pageSize } = validatePaginationParams(
      options.page,
      options.pageSize
    );

    return NGORequestRepository.findByNgoId(ngoId, page, pageSize);
  },

  /**
   * Fetch NGO requests by Disaster
   */
  getRequestsByDisasterId: async (
    disasterId: string,
    options: FetchOptions = {}
  ) => {
    if (!disasterId || typeof disasterId !== "string") {
      throw new Error("INVALID_DISASTER_ID");
    }

    const { page, pageSize } = validatePaginationParams(
      options.page,
      options.pageSize
    );

    return NGORequestRepository.findByDisasterId(
      disasterId,
      page,
      pageSize
    );
  },

  /**
   * Fetch NGO requests by Government
   */
  getRequestsByGovernmentId: async (
    governmentId: string,
    options: FetchOptions = {}
  ) => {
    if (!governmentId || typeof governmentId !== "string") {
      throw new Error("INVALID_GOVERNMENT_ID");
    }

    const { page, pageSize } = validatePaginationParams(
      options.page,
      options.pageSize
    );

    return NGORequestRepository.findByGovernmentId(
      governmentId,
      page,
      pageSize
    );
  },
};
