import { NGORepository } from "@/app/repositories/ngo.repo";
import { sanitizeInput } from "@/app/lib/sanitize";

export const NGOService = {
  /**
   * Get all NGOs (public)
   * @returns Array of all NGOs
   */
  getAll: async () => {
    return NGORepository.getAll();
  },

  /**
   * Get NGOs by state
   * @param state - State name
   * @returns Array of NGOs in that state
   */
  getByState: async (state: any) => {
    if (!state) {
      throw new Error("STATE_REQUIRED");
    }

    const cleanState = sanitizeInput(state);

    return NGORepository.getByState(cleanState);
  },

  /**
   * Get NGOs for government admin's state (from token)
   * More secure as state comes from authenticated token
   * @param state - Government admin's state from JWT token
   * @param governmentId - Government admin's government ID
   * @returns Array of NGOs in that state
   */
  getByGovernmentState: async (state: any, governmentId: string) => {
    if (!state) {
      throw new Error("STATE_REQUIRED");
    }

    if (!governmentId) {
      throw new Error("GOVERNMENT_ID_REQUIRED");
    }

    const cleanState = sanitizeInput(state);

    return NGORepository.getByState(cleanState);
  },

  
};
