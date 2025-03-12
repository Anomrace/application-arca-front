<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> 🎵 École de Musique </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer (Menu latéral) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>

        <q-item to="/eleves" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Élèves</q-item-section>
        </q-item>

        <q-item to="/planning" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>
          <q-item-section>Planning</q-item-section>
        </q-item>

        <q-item to="/factures" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>Factures</q-item-section>
        </q-item>

        <q-item to="/professeurs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Professeurs</q-item-section>
        </q-item>

        <!-- Affichage de la version Quasar -->
        <q-item>
          <q-item-section>
            <q-item-label caption>Quasar v{{ $q.version }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenu de la page -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
