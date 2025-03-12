<template>
  <div>
    <q-option-group
      v-model="localData.courseType"
      :options="courseOptions"
      inline
      type="radio"
      label="Type de cours"
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

const courseOptions = [
  { label: 'Cours individuel', value: 'individual' },
  { label: 'Cours de groupe', value: 'group' },
]

const validate = () => !!localData.value.courseType

defineExpose({ validate })
</script>
