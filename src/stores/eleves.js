import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from 'boot/axios' // ou le chemin vers votre instance Axios

export const useElevesStore = defineStore('eleves', () => {
  const eleves = ref([])

  // 🔹 Récupérer tous les élèves
  async function fetchEleves() {
    try {
      const { data } = await api.get('/eleves')
      eleves.value = data
    } catch (error) {
      console.error('❌ Erreur récupération élèves :', error)
    }
  }

  // 🔹 Ajouter un élève (avec user nested create)
  async function addEleve(eleveData) {
    try {
      const { data } = await api.post('/eleves', eleveData)
      // On peut pousser directement l'élève créé
      eleves.value.push(data)
    } catch (error) {
      console.error('❌ Erreur ajout élève :', error)
    }
  }

  // 🔹 Modifier un élève
  async function updateEleve(eleveId, updates) {
    try {
      const { data } = await api.put(`/eleves/${eleveId}`, updates)
      const index = eleves.value.findIndex((e) => e.id === eleveId)
      if (index !== -1) {
        eleves.value[index] = data
      }
    } catch (error) {
      console.error('❌ Erreur modification élève :', error)
    }
  }

  // 🔹 Supprimer un élève
  async function deleteEleve(eleveId) {
    try {
      await api.delete(`/eleves/${eleveId}`)
      // Retirer l'élève du tableau local
      eleves.value = eleves.value.filter((e) => e.id !== eleveId)
    } catch (error) {
      console.error('❌ Erreur suppression élève :', error)
    }
  }

  return {
    eleves,
    fetchEleves,
    addEleve,
    updateEleve,
    deleteEleve,
  }
})
