import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from 'boot/axios'

export const useFacturesStore = defineStore('factures', () => {
  const factures = ref([])

  // 🔹 Récupérer les factures d'un client
  async function fetchFacturesByClient(clientId) {
    try {
      const { data } = await api.get(`/factures/client/${clientId}`)
      factures.value = data
    } catch (error) {
      console.error('❌ Erreur récupération factures :', error)
    }
  }

  // 🔹 Générer une facture
  async function generateFacture(factureData) {
    try {
      const { data } = await api.post('/factures/generate', factureData)
      // Vous pouvez pousser la nouvelle facture dans factures.value
      factures.value.push(data.facture)
      return data
    } catch (error) {
      console.error('❌ Erreur génération facture :', error)
      throw error
    }
  }

  // 🔹 Supprimer une facture
  async function deleteFacture(factureId) {
    try {
      await api.delete(`/factures/${factureId}`)
      factures.value = factures.value.filter((f) => f.id !== factureId)
    } catch (error) {
      console.error('❌ Erreur suppression facture :', error)
    }
  }

  return {
    factures,
    fetchFacturesByClient,
    generateFacture,
    deleteFacture,
  }
})
