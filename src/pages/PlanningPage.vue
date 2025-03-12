<template>
  <q-page padding>
    <h2>📅 Planning des cours</h2>

    <!-- 🔥 Filtres -->
    <div class="q-mb-md row q-gutter-md">
      <q-select
        v-model="selectedProf"
        :options="profsOptions"
        label="Filtrer par professeur"
        dense
        clearable
      />
      <q-select
        v-model="selectedEleve"
        :options="elevesOptions"
        label="Filtrer par élève"
        dense
        clearable
      />
      <q-select
        v-model="selectedLieu"
        :options="lieuxOptions"
        label="Filtrer par lieu"
        dense
        clearable
      />
    </div>

    <!-- 🔹 Calendrier interactif -->
    <vue-cal
      locale="fr"
      :events="filteredCours"
      :time="true"
      active-view="week"
      :disable-views="['years', 'month']"
      @cell-click="addCours"
      @event-click="editCours"
    />

    <!-- 🔹 Formulaire Ajouter / Modifier un cours -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <q-input v-model="cours.date" label="Date" type="datetime-local" dense />

          <q-select
            v-model="cours.eleveId"
            :options="elevesOptions"
            label="Élève"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
          />

          <q-select
            v-model="cours.profId"
            :options="profsOptions"
            label="Professeur"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
          />

          <q-input v-model="cours.lieu" label="Lieu" dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="editMode" label="🗑 Supprimer" color="red" @click="deleteCours" />
          <q-btn label="Annuler" color="grey" @click="closeModal" />
          <q-btn :label="editMode ? 'Modifier' : 'Ajouter'" color="primary" @click="saveCours" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useCoursStore } from 'src/stores/cours'
import { useElevesStore } from 'src/stores/eleves'
import { useProfesseursStore } from 'src/stores/professeurs'

// 🔹 Stores
const coursStore = useCoursStore()
const elevesStore = useElevesStore()
const profsStore = useProfesseursStore()

// 🔹 Filtres
const selectedProf = ref(null)
const selectedEleve = ref(null)
const selectedLieu = ref(null)

// 🔹 Variables pour le formulaire
const dialog = ref(false)
const editMode = ref(false)
const cours = ref({ id: '', date: '', eleveId: '', profId: '', lieu: '' })

// 🔹 Charger les données
onMounted(async () => {
  await coursStore.fetchCours()
  await elevesStore.fetchEleves()
  await profsStore.fetchProfesseurs()
})

// 🔹 Options pour les filtres et formulaire
const profsOptions = computed(() =>
  profsStore.professeurs.map((prof) => ({ label: prof.nom, value: prof.id })),
)
const elevesOptions = computed(() =>
  elevesStore.eleves.map((eleve) => ({ label: eleve.nom, value: eleve.id })),
)
const lieuxOptions = computed(() => {
  const lieux = [...new Set(coursStore.cours.map((c) => c.lieu))]
  return lieux.map((lieu) => ({ label: lieu, value: lieu }))
})

// 🔹 Filtrer les cours
const filteredCours = computed(() => {
  let result = [...coursStore.cours]

  if (selectedProf.value) result = result.filter((c) => c.profId === selectedProf.value)
  if (selectedEleve.value) result = result.filter((c) => c.eleveId === selectedEleve.value)
  if (selectedLieu.value) result = result.filter((c) => c.lieu === selectedLieu.value)

  return result.map((c) => ({
    id: c.id,
    start: new Date(c.date),
    end: new Date(new Date(c.date).getTime() + 3600000), // 🔥 Ajoute 1h
    title: `${c.eleve?.nom || 'Élève inconnu'} avec ${c.professeur?.nom || 'Prof inconnu'} (${c.lieu})`,
  }))
})

// 🔹 Ajouter un cours
function addCours(event) {
  const startDate = event?.start || new Date()

  cours.value = {
    id: '',
    date: startDate.toISOString().slice(0, 16),
    eleveId: '',
    profId: '',
    lieu: '',
  }
  editMode.value = false
  dialog.value = true
}

// 🔹 Modifier un cours
function editCours(event) {
  console.log('✏️ Modifier le cours :', event)

  const selected = coursStore.cours.find((c) => c.id === event.id)

  if (!selected) {
    console.error('❌ ERREUR : Aucun cours trouvé avec cet ID !')
    return
  }

  console.log('✅ Cours sélectionné avant conversion :', selected)

  // 🔥 Corriger la conversion de la date pour affichage
  const dateLocale = new Date(selected.date)
  dateLocale.setMinutes(dateLocale.getMinutes() - dateLocale.getTimezoneOffset()) // ✅ Ajuste le fuseau

  // 🔥 Cloner l'objet correctement
  cours.value = {
    id: selected.id,
    date: dateLocale.toISOString().slice(0, 16), // ✅ Format correct pour `<input type="datetime-local">`
    eleveId: selected.eleveId,
    profId: selected.profId,
    lieu: selected.lieu || '',
  }

  console.log('🎯 Cours chargé pour modification :', cours.value)

  editMode.value = true
  dialog.value = true
}

// 🔹 Supprimer un cours
async function deleteCours() {
  if (!cours.value.id) return

  if (confirm('🗑 Supprimer ce cours ?')) {
    try {
      await coursStore.deleteCours(cours.value.id)
      await coursStore.fetchCours() // 🔄 Rafraîchir la liste
      dialog.value = false // ❌ Fermer le modal
    } catch (error) {
      console.error('❌ Erreur lors de la suppression :', error)
    }
  }
}

// 🔹 Fermer le modal
function closeModal() {
  dialog.value = false
}

// 🔹 Sauvegarder un cours
async function saveCours() {
  console.log('📤 Tentative de modification du cours :', cours.value)

  // 🔥 Conversion correcte pour éviter le changement d'heure
  const dateObj = new Date(cours.value.date)
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset()) // ✅ Corrige l'heure avant envoi

  const coursData = {
    id: String(cours.value.id),
    date: dateObj.toISOString(), // ✅ Garde la bonne heure
    eleveId: cours.value.eleveId,
    profId: cours.value.profId,
    lieu: cours.value.lieu.trim(),
  }

  console.log('📤 Données envoyées au backend :', coursData)

  try {
    if (editMode.value) {
      await coursStore.updateCours(coursData)
    } else {
      await coursStore.addCours(coursData)
    }

    console.log('✅ Mise à jour réussie, récupération des nouveaux cours...')
    await coursStore.fetchCours()

    console.log('🎯 Cours rechargés :', coursStore.cours)
    dialog.value = false
  } catch (error) {
    console.error('❌ Erreur lors de l’enregistrement :', error)
  }
}
</script>
