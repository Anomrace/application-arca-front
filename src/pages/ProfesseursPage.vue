<template>
  <q-page padding>
    <h2>👨‍🏫 Liste des professeurs</h2>

    <!-- 🔹 Bouton Ajouter -->
    <q-btn label="Ajouter un professeur" color="primary" @click="openDialog()" class="q-mb-md" />

    <!-- 🔹 Tableau des professeurs -->
    <q-table
      :rows="profStore.professeurs"
      :columns="columns"
      row-key="id"
      dense
      title="Professeurs"
    >
      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn icon="edit" color="blue" flat @click="openDialog(props.row)" />
          <q-btn icon="delete" color="red" flat @click="deleteProfesseur(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- 🔹 Formulaire Ajouter / Modifier -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <q-input v-model="prof.nom" label="Nom du professeur" dense />
          <q-input v-model="prof.prenom" label="Prénom" dense />
          <q-input v-model="prof.email" label="Email" type="email" dense />
          <q-input v-model="prof.telephone" label="Téléphone" dense />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Annuler" color="grey" @click="dialog = false" />
          <q-btn
            :label="editMode ? 'Modifier' : 'Ajouter'"
            color="primary"
            @click="saveProfesseur"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProfesseursStore } from 'src/stores/professeurs'

// 🔹 Store des professeurs
const profStore = useProfesseursStore()

// 🔹 Variables
const dialog = ref(false)
const editMode = ref(false)
const prof = ref({ id: '', nom: '', email: '' })

// 🔹 Colonnes du tableau
const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left', sortable: true },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'telephone', label: 'Téléphone', field: 'telephone', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' },
]

// 🔹 Charger les professeurs au montage
onMounted(() => {
  profStore.fetchProfesseurs()
})

// 🔹 Ouvrir le formulaire (ajout ou modification)
function openDialog(profToEdit = null) {
  if (profToEdit) {
    prof.value = { ...profToEdit }
    editMode.value = true
  } else {
    prof.value = { id: '', nom: '', email: '' }
    editMode.value = false
  }
  dialog.value = true
}

// 🔹 Ajouter ou Modifier un professeur
async function saveProfesseur() {
  console.log('📤 Données envoyées :', prof.value)

  const profData = {
    id: editMode.value ? prof.value.id : undefined, // ✅ Ajoute l'ID seulement en mode édition
    nom: prof.value.nom || '',
    prenom: prof.value.prenom || '',
    email: prof.value.email || '',
    telephone: prof.value.telephone || '',
  }

  try {
    if (editMode.value) {
      await profStore.updateProfesseur(profData) // 🔥 L'ID sera bien envoyé
    } else {
      await profStore.addProfesseur(profData)
    }

    await profStore.fetchProfesseurs()
    dialog.value = false
  } catch (error) {
    console.error('❌ Erreur API :', error)
  }
}

// 🔹 Supprimer un professeur
async function deleteProfesseur(id) {
  if (confirm('❌ Supprimer ce professeur ?')) {
    try {
      await profStore.deleteProfesseur(id)
      await profStore.fetchProfesseurs()
    } catch (error) {
      console.error('❌ Impossible de supprimer :', error)
      alert('Ce professeur ne peut pas être supprimé car il a des cours associés.')
    }
  }
}
</script>
