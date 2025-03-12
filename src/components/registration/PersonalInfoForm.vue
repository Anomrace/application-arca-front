<template>
  <div>
    <q-input
      v-model="localData.firstName"
      label="Prénom"
      outlined
      :rules="[(val) => !!val || 'Prénom requis']"
      lazy-rules
    />
    <q-input
      v-model="localData.lastName"
      label="Nom"
      outlined
      :rules="[(val) => !!val || 'Nom requis']"
      lazy-rules
      class="q-mt-sm"
    />
    <q-input
      v-model="localData.birthDate"
      label="Date de naissance"
      type="date"
      outlined
      :rules="[(val) => !!val || 'Date de naissance requise']"
      lazy-rules
      class="q-mt-sm"
    />
    <q-input
      v-model="localData.email"
      label="Email"
      type="email"
      outlined
      :rules="[
        (val) => !!val || 'Email requis',
        (val) => /.+@.+\..+/.test(val) || 'Email invalide',
      ]"
      lazy-rules
      class="q-mt-sm"
    />
    <q-input
      v-model="localData.phone"
      label="Téléphone"
      type="tel"
      outlined
      :rules="[(val) => !!val || 'Téléphone requis']"
      lazy-rules
      class="q-mt-sm"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: Object,
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

const validate = () => {
  const { firstName, lastName, birthDate, email, phone } = localData.value
  if (!firstName || !lastName || !birthDate || !email || !phone) return false
  if (!/.+@.+\..+/.test(email)) return false
  return true
}

defineExpose({ validate })
</script>
