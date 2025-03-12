<template>
  <div>
    <q-input
      v-model="localData.address"
      label="Adresse"
      outlined
      :rules="[(val) => !!val || 'Adresse requise']"
      lazy-rules
    />
    <q-input
      v-model="localData.postalCode"
      label="Code postal"
      outlined
      :rules="[(val) => !!val || 'Code postal requis']"
      lazy-rules
      class="q-mt-sm"
    />
    <q-input
      v-model="localData.city"
      label="Ville"
      outlined
      :rules="[(val) => !!val || 'Ville requise']"
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
  const { address, postalCode, city } = localData.value
  if (!address || !postalCode || !city) return false
  return true
}

defineExpose({ validate })
</script>
