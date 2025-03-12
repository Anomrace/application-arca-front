import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProfesseursStore = defineStore('professeurs', () => {
  const professeurs = ref([])

  // 🔹 Récupérer la liste des profs
  async function fetchProfesseurs() {
    try {
      const { data } = await axios.get('http://localhost:3000/professeurs')
      professeurs.value = data
    } catch (error) {
      console.error('Erreur lors de la récupération des professeurs :', error)
    }
  }

  // 🔹 Ajouter un professeur
  async function addProfesseur(professeur) {
    try {
      await axios.post('http://localhost:3000/professeurs', professeur)
      await fetchProfesseurs()
    } catch (error) {
      console.error('Erreur lors de l’ajout du professeur :', error)
    }
  }

  // 🔹 Modifier un professeur
  async function updateProfesseur(professeur) {
    try {
      await axios.put(`http://localhost:3000/professeurs/${professeur.id}`, professeur)
      await fetchProfesseurs()
    } catch (error) {
      console.error('Erreur lors de la modification du professeur :', error)
    }
  }

  // 🔹 Supprimer un professeur
  async function deleteProfesseur(id) {
    try {
      await axios.delete(`http://localhost:3000/professeurs/${id}`)
      await fetchProfesseurs()
    } catch (error) {
      console.error('Erreur lors de la suppression du professeur :', error)
    }
  }

  return { professeurs, fetchProfesseurs, addProfesseur, updateProfesseur, deleteProfesseur }
})
