<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Connexion</div>
        <q-input v-model="email" label="Email" type="email" outlined class="q-mt-sm" />
        <q-input v-model="password" label="Mot de passe" type="password" outlined class="q-mt-sm" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Se connecter" @click="handleLogin" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user'
import { Notify } from 'quasar'

const email = ref('')
const password = ref('')

const router = useRouter()
const userStore = useUserStore()

// LoginPage.vue
const handleLogin = () => {
  if (!email.value || !password.value) {
    Notify.create({
      message: 'Veuillez renseigner votre email et mot de passe',
      color: 'negative',
    })
    return
  }

  // Exemple de logique de détermination du rôle par email
  let role = 'student'
  const em = email.value.toLowerCase()
  if (em.includes('admin')) {
    role = 'admin'
  } else if (em.includes('prof')) {
    role = 'professor'
  } else if (em.includes('parent')) {
    role = 'parent'
  }

  // Stocker directement l'utilisateur avec email et role
  userStore.login({ email: email.value, role })
  Notify.create({
    message: 'Connexion réussie',
    color: 'positive',
  })
  router.push('/')
}
</script>
