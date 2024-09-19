import { defineStore } from 'pinia'

export const useRapStore = defineStore('rap', {
  state: () => ({
    rapText: '',
  }),
  actions: {
    async setRapText(rap: String) {
      this.rapText = rap
    }
  }
})
