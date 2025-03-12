<template>
  <q-page class="q-pa-md">
    <q-stepper v-model="currentStep" animated>
      <!-- Étape 1 : Informations personnelles -->
      <q-step name="1" title="Infos personnelles" icon="person">
        <q-card class="q-pa-md">
          <PersonalInfoForm ref="personalInfoRef" v-model="formData" />
          <q-card-actions align="right">
            <q-btn color="primary" label="Suivant" @click="validatePersonalInfo" />
          </q-card-actions>
        </q-card>
      </q-step>

      <!-- Étape 2 : Adresse -->
      <q-step name="2" title="Adresse" icon="home">
        <q-card class="q-pa-md">
          <AddressForm ref="addressInfoRef" v-model="formData" />
          <q-card-actions align="between">
            <q-btn flat label="Précédent" @click="prevStep" />
            <q-btn color="primary" label="Suivant" @click="validateAddressInfo" />
          </q-card-actions>
        </q-card>
      </q-step>

      <!-- Étape 3 : Type de cours -->
      <q-step name="3" title="Type de cours" icon="school">
        <q-card class="q-pa-md">
          <CourseTypeSelection ref="courseTypeRef" v-model="formData" />
          <q-card-actions align="between">
            <q-btn flat label="Précédent" @click="prevStep" />
            <q-btn color="primary" label="Suivant" @click="validateCourseType" />
          </q-card-actions>
        </q-card>
      </q-step>

      <!-- Étape 4 : Instrument -->
      <q-step name="4" title="Instrument" icon="music_note">
        <q-card class="q-pa-md">
          <InstrumentSelection
            ref="instrumentSelectionRef"
            v-model="formData"
            :birthDate="formData.birthDate"
            :courseType="formData.courseType"
          />
          <q-card-actions align="between">
            <q-btn flat label="Précédent" @click="prevStep" />
            <q-btn color="primary" label="Suivant" @click="validateInstrument" />
          </q-card-actions>
        </q-card>
      </q-step>

      <!-- Étape 5 : Confirmation -->
      <q-step name="5" title="Confirmation" icon="check_circle">
        <q-card class="q-pa-md">
          <RegistrationReview :formData="formData" />
          <q-card-actions align="between">
            <q-btn flat label="Précédent" @click="prevStep" />
            <q-btn color="primary" label="Soumettre" @click="submitRegistration" />
          </q-card-actions>
        </q-card>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import PersonalInfoForm from 'components/registration/PersonalInfoForm.vue'
import AddressForm from 'components/registration/AddressForm.vue'
import CourseTypeSelection from 'components/registration/CourseTypeSelection.vue'
import InstrumentSelection from 'components/registration/InstrumentSelection.vue'
import RegistrationReview from 'components/registration/RegistrationReview.vue'

const currentStep = ref(1)
const formData = ref({
  // Informations personnelles
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  // Adresse
  address: '',
  postalCode: '',
  city: '',
  // Type de cours
  courseType: '',
  // Instrument sélectionné
  instrument: '',
})

// Déclaration des références pour accéder aux méthodes validate() des composants enfants
const personalInfoRef = ref(null)
const addressInfoRef = ref(null)
const courseTypeRef = ref(null)
const instrumentSelectionRef = ref(null)

// Méthodes de validation
const validatePersonalInfo = () => {
  if (personalInfoRef.value && personalInfoRef.value.validate()) {
    currentStep.value++
  } else {
    Notify.create({
      message: 'Veuillez corriger les erreurs dans vos informations personnelles',
      color: 'negative',
    })
  }
}

const validateAddressInfo = () => {
  if (addressInfoRef.value && addressInfoRef.value.validate()) {
    currentStep.value++
  } else {
    Notify.create({
      message: 'Veuillez corriger les erreurs dans votre adresse',
      color: 'negative',
    })
  }
}

const validateCourseType = () => {
  if (courseTypeRef.value && courseTypeRef.value.validate()) {
    currentStep.value++
  } else {
    Notify.create({
      message: 'Veuillez choisir un type de cours',
      color: 'negative',
    })
  }
}

const validateInstrument = () => {
  if (instrumentSelectionRef.value && instrumentSelectionRef.value.validate()) {
    currentStep.value++
  } else {
    Notify.create({
      message: 'Veuillez choisir un instrument valide',
      color: 'negative',
    })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitRegistration = () => {
  console.log("Données d'inscription soumises :", formData.value)
  Notify.create({
    message: 'Inscription soumise avec succès !',
    color: 'positive',
  })
  // Ici, appelez votre API pour enregistrer l'inscription avec un statut "attente"
}
</script>
