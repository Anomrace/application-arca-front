import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCoursStore = defineStore('cours', () => {
  const cours = ref([])

  async function fetchCours() {
    try {
      const { data } = await axios.get('http://localhost:3000/cours')
      console.log('🔥 Cours récupérés depuis l’API :', data) // 🔥 Vérifier les cours reçus
      cours.value = data
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cours :', error)
    }
  }

  async function addCours(newCours) {
    try {
      const { data } = await axios.post('http://localhost:3000/cours', newCours)
      console.log('✅ Cours ajouté :', data) // Debugging
      cours.value.push(data)
    } catch (error) {
      console.error('❌ Erreur lors de l’ajout du cours :', error)
    }
  }

  async function updateCours(updatedCours) {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/cours/${updatedCours.id}`,
        updatedCours,
      )
      console.log('✅ Cours mis à jour :', data) // Debugging
      const index = cours.value.findIndex((c) => c.id === updatedCours.id)
      if (index !== -1) {
        cours.value[index] = data
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du cours :', error)
    }
  }

  async function deleteCours(coursId) {
    try {
      await axios.delete(`http://localhost:3000/cours/${coursId}`)
      console.log('🗑️ Cours supprimé ID :', coursId) // Debugging
      cours.value = cours.value.filter((c) => c.id !== coursId)
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cours :', error)
    }
  }

  return { cours, fetchCours, addCours, updateCours, deleteCours } // 🔥 Ajout des nouvelles fonctions
})
