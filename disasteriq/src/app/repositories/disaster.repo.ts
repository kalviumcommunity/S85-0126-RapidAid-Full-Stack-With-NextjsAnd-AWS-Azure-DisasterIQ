const disasters: any[] = []



export const DisasterRepository = {
  save(disaster: any) {
    disasters.push(disaster)
    return disaster
  },

  findAll() {
    return disasters
  },

  update(id: string, updates: any) {
    const d = disasters.find(x => x.id === id)
    if (!d) return null

    Object.assign(d, updates)
    return d
  },

  delete(id: string) {
    const index = disasters.findIndex(x => x.id === id)
    if (index === -1) return null

    return disasters.splice(index, 1)[0]
  }
}
