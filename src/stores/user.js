import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // { email, role, ... }
  }),
  actions: {
    login(userData) {
      this.user = userData
    },
    logout() {
      this.user = null
    },
    isAuthenticated() {
      return !!this.user
    },
    hasRole(allowedRoles = []) {
      if (!this.user) return false
      return allowedRoles.includes(this.user.role)
    },
  },
  // Optionnel : persister l'état pour ne pas perdre la connexion au rechargement
  persist: true,
})
