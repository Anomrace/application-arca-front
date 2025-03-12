<template>
  <div>
    <div v-if="!allowedAge">
      <q-banner color="negative">
        <div>Votre âge ({{ age }} ans) ne correspond pas aux critères pour ce type de cours.</div>
      </q-banner>
    </div>
    <q-select
      v-if="allowedAge"
      v-model="localData.instrument"
      label="Choisissez un instrument"
      :options="instrumentOptions"
      outlined
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
const props = defineProps({
  modelValue: Object,
  birthDate: String,
  courseType: String,
})
const emit = defineEmits(['update:modelValue'])
const localData = ref({ ...props.modelValue })
watch(
  localData,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

// Calcul de l'âge à partir de la date de naissance
const age = computed(() => {
  if (!props.birthDate) return null
  const birth = new Date(props.birthDate)
  const today = new Date()
  let ageCalc = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    ageCalc--
  }
  return ageCalc
})

// Déterminer si l'âge est dans la plage autorisée
const allowedAge = computed(() => {
  if (props.courseType === 'individual') {
    return age.value >= 3 && age.value <= 103
  } else if (props.courseType === 'group') {
    return age.value >= 3 && age.value <= 5
  }
  return false
})

// Options d'instrument en fonction du type de cours
const instrumentOptions = computed(() => {
  if (props.courseType === 'individual') {
    return [
      'Piano',
      'Violon',
      'Violoncelle',
      'Clarinette',
      'Guitare classique',
      'Guitare électrique',
      'Basse',
      'Chant classique',
      'Chant pop',
      'Chant jazz',
      'Houd',
      'Harpe',
      'Batterie',
    ].map((item) => ({ label: item, value: item }))
  } else if (props.courseType === 'group') {
    return ['Piano', 'Violon', 'Chant', 'Guitare'].map((item) => ({ label: item, value: item }))
  }
  return []
})

const validate = () => {
  if (!allowedAge.value) return false
  return !!localData.value.instrument
}

defineExpose({ validate })
</script>
