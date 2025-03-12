<template>
  <q-page padding>
    <h2>👨‍🎓 Liste des élèves</h2>

    <!-- 🔹 Barre de recherche et tri -->
    <q-input v-model="search" label="Rechercher un élève" dense clearable class="q-mb-md" />
    <q-select
      v-model="sortOrder"
      :options="[
        { label: 'A-Z', value: 'asc' },
        { label: 'Z-A', value: 'desc' },
      ]"
      label="Trier par nom"
      dense
      class="q-mb-md"
    />

    <!-- 🔥 Filtrer par professeur -->
    <q-select
      v-model="selectedProf"
      :options="profsOptions"
      label="Filtrer par professeur"
      option-label="label"
      option-value="value"
      emit-value
      map-options
      dense
      clearable
      class="q-mb-md"
    />

    <!-- 🔹 Bouton Ajouter -->
    <q-btn label="Ajouter un élève" color="primary" @click="openDialog()" class="q-mb-md" />

    <!-- 🔹 Tableau des élèves -->
    <q-table :rows="filteredEleves" :columns="columns" row-key="id" dense title="Élèves inscrits">
      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn icon="edit" color="blue" flat @click="openDialog(props.row)" />
          <q-btn icon="delete" color="red" flat @click="deleteEleve(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <!-- 🔹 Formulaire Ajouter / Modifier un élève -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <q-input v-model="eleve.user.lastName" label="Nom" dense />
          <q-input v-model="eleve.user.firstName" label="Prénom" dense />
          <q-input v-model="eleve.user.email" label="Email" type="email" dense />
          <q-input v-model="eleve.telephone" label="Téléphone" type="tel" dense />
          <!-- Sélection du professeur -->
          <q-select
            v-model="selectedProfForm"
            :options="profsOptions"
            label="Professeur"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
            @update:model-value="updateProfId"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Annuler" color="grey" @click="dialog = false" />
          <q-btn :label="editMode ? 'Modifier' : 'Ajouter'" color="primary" @click="saveEleve" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useElevesStore } from 'src/stores/eleves'
import { useProfesseursStore } from 'src/stores/professeurs'

// Stores
const store = useElevesStore()
const profStore = useProfesseursStore()

// Variables de recherche et tri
const search = ref('')
const sortOrder = ref('asc')
const selectedProf = ref(null)

// Variables pour le formulaire
const dialog = ref(false)
const editMode = ref(false)
// Structure locale : on conserve les champs spécifiques dans "eleve", et les informations utilisateur dans "user"
const eleve = ref({
  id: '',
  telephone: '',
  profId: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
  },
})
const selectedProfForm = ref(null)

// Colonnes du tableau
const columns = [
  {
    name: 'lastName',
    label: 'Nom',
    field: (row) => (row.user ? row.user.lastName : '—'),
    align: 'left',
    sortable: true,
  },
  {
    name: 'firstName',
    label: 'Prénom',
    field: (row) => (row.user ? row.user.firstName : '—'),
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    field: (row) => (row.user ? row.user.email : '—'),
    align: 'left',
  },
  {
    name: 'professeur',
    label: 'Professeur',
    field: (row) =>
      row.professeur && row.professeur.user ? row.professeur.user.lastName : 'Non assigné',
    align: 'left',
  },
  { name: 'actions', label: 'Actions', align: 'right' },
]

// Charger les données au montage
onMounted(async () => {
  await store.fetchEleves()
  await profStore.fetchProfesseurs()
  console.log('✅ Élèves chargés :', store.eleves)
  console.log('✅ Professeurs chargés :', profStore.professeurs)
})

// Options pour le q-select des professeurs
const profsOptions = computed(() =>
  Array.isArray(profStore.professeurs)
    ? profStore.professeurs.map((prof) => ({
        label: prof.user ? prof.user.lastName : 'Inconnu',
        value: prof.id,
      }))
    : [],
)

// Filtrer les élèves par nom/prénom et par professeur
const filteredEleves = computed(() => {
  let result = Array.isArray(store.eleves) ? store.eleves : []

  if (search.value) {
    result = result.filter(
      (e) =>
        (e.user && e.user.lastName.toLowerCase().includes(search.value.toLowerCase())) ||
        (e.user && e.user.firstName.toLowerCase().includes(search.value.toLowerCase())),
    )
  }

  if (selectedProf.value) {
    result = result.filter((e) => e.profId === selectedProf.value)
  }

  return result
})

// Mettre à jour profId dans le formulaire lors de la sélection
function updateProfId(value) {
  selectedProfForm.value = value
  eleve.value.profId = value
}

// Ouvrir le formulaire (ajout ou modification)
function openDialog(eleveToEdit = null) {
  if (eleveToEdit) {
    editMode.value = true
    // Remplir le formulaire avec les données de l'élève
    eleve.value.id = eleveToEdit.id
    eleve.value.telephone = eleveToEdit.telephone || ''
    eleve.value.profId = eleveToEdit.profId || null
    eleve.value.user.firstName = eleveToEdit.user ? eleveToEdit.user.firstName : ''
    eleve.value.user.lastName = eleveToEdit.user ? eleveToEdit.user.lastName : ''
    eleve.value.user.email = eleveToEdit.user ? eleveToEdit.user.email : ''
    selectedProfForm.value = eleveToEdit.profId || null
  } else {
    editMode.value = false
    eleve.value = {
      id: '',
      telephone: '',
      profId: null,
      user: { firstName: '', lastName: '', email: '' },
    }
    selectedProfForm.value = null
  }
  dialog.value = true
}

// Sauvegarder (ajouter ou mettre à jour) l'élève
async function saveEleve() {
  console.log("📤 Envoi de l'élève :", eleve.value)
  if (editMode.value) {
    await store.updateEleve(eleve.value.id, {
      telephone: eleve.value.telephone,
      profId: eleve.value.profId,
      // Pour update, on envoie les champs utilisateur nécessaires
      nom: eleve.value.user.lastName,
      prenom: eleve.value.user.firstName,
      email: eleve.value.user.email,
    })
  } else {
    await store.addEleve({
      telephone: eleve.value.telephone,
      profId: eleve.value.profId,
      nom: eleve.value.user.lastName,
      prenom: eleve.value.user.firstName,
      email: eleve.value.user.email,
    })
  }
  await store.fetchEleves() // Rafraîchir la liste
  dialog.value = false
}

// Supprimer un élève
async function deleteEleve(id) {
  if (confirm('Supprimer cet élève ?')) {
    await store.deleteEleve(id)
    await store.fetchEleves()
  }
}
</script>
