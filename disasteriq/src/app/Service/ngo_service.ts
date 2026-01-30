import { NGORepository } from "@/app/repositories/ngo.repo";
import { sanitizeInput } from "@/app/lib/sanitize";

export const NGOService = {
  getByState: async (state:any) => {
    if (!state) {
      throw new Error("STATE_REQUIRED");
    }

    const cleanState = sanitizeInput(state);

    return NGORepository.getByState(cleanState);
  },
};
