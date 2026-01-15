import { DisasterRepository } from "@/app/repositories/disaster.repo"

import { randomUUID } from "crypto"

export const DisasterService = {

  createDisaster(title: string, location: string, severity: string) {
    const disaster = {
      id: randomUUID(),
      title,
      location,
      severity,
      status: "ACTIVE",
      createdAt: new Date()
    }

    return DisasterRepository.save(disaster)
  },

  getAllDisasters() {
    return DisasterRepository.findAll()
  },

  updateDisaster(id: string, data: any) {
    return DisasterRepository.update(id, data)
  },

  deleteDisaster(id: string) {
    return DisasterRepository.delete(id)
  },

  getStats() {
    const all = DisasterRepository.findAll()

    return {
      total: all.length,
      active: all.filter(d => d.status === "ACTIVE").length,
      highSeverity: all.filter(d => d.severity === "HIGH").length
    }
  }
}
