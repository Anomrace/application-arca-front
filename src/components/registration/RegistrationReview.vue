<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Vérifiez vos informations</div>
      <p><strong>Nom:</strong> {{ formData.firstName }} {{ formData.lastName }}</p>
      <p><strong>Date de naissance:</strong> {{ formData.birthDate }}</p>
      <p><strong>Email:</strong> {{ formData.email }}</p>
      <p><strong>Téléphone:</strong> {{ formData.phone }}</p>
      <p>
        <strong>Adresse:</strong> {{ formData.address }}, {{ formData.postalCode }},
        {{ formData.city }}
      </p>
      <p>
        <strong>Type de cours:</strong>
        {{ formData.courseType === 'individual' ? 'Cours individuel' : 'Cours de groupe' }}
      </p>
      <p><strong>Instrument:</strong> {{ formData.instrument }}</p>
    </q-card-section>
  </q-card>
</template>

<script setup>
const { formData } = defineProps({
  formData: Object,
})
</script>
