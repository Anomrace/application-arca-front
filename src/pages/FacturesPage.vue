<template>
  <q-page class="q-pa-md">
    <q-table title="Factures Clients" :rows="clients" :columns="columns" row-key="id" dense>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" label="Générer Facture" @click="openModal(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-factures="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.facture"
            color="green"
            label="Télécharger"
            icon="download"
            @click="downloadInvoice(props.row.facture.id)"
          />
          <q-chip v-else color="grey" text-color="white">Aucune facture</q-chip>
        </q-td>
      </template>
    </q-table>

    <!-- Modal pour générer une facture -->
    <q-dialog v-model="modalOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Créer une facture</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.amount" label="Montant" type="number" />
          <q-input v-model="form.reference" label="Référence" />
          <q-input v-model="form.invoiceNumber" label="Numéro de facture" />
          <q-input v-model="form.date" label="Date de facture" type="date" />

          <!-- Informations du créditeur (vous pouvez les pré-remplir ou les fixer si constant) -->
          <q-input v-model="form.creditor.name" label="Nom Créditeur" />
          <q-input v-model="form.creditor.street" label="Rue Créditeur" />
          <q-input v-model="form.creditor.zip" label="Code postal Créditeur" />
          <q-input v-model="form.creditor.city" label="Ville Créditeur" />
          <q-input v-model="form.creditor.account" label="Compte Créditeur" />

          <!-- Informations du débiteur (pré-remplies avec le client sélectionné) -->
          <q-input v-model="form.debtor.name" label="Nom Débiteur" />
          <q-input v-model="form.debtor.street" label="Rue Débiteur" />
          <q-input v-model="form.debtor.zip" label="Code postal Débiteur" />
          <q-input v-model="form.debtor.city" label="Ville Débiteur" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn color="primary" label="Générer" @click="generateFacture" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFacturesStore } from 'src/stores/factures'
import { api } from 'boot/axios'

const facturesStore = useFacturesStore()
const clients = ref([]) // par exemple, la liste des élèves clients
const modalOpen = ref(false)
const form = ref({
  clientId: null,
  clientName: '',
  amount: '',
  reference: '',
  invoiceNumber: '',
  date: '',
  creditor: {
    name: '',
    street: '',
    zip: '',
    city: '',
    account: '',
  },
  debtor: {
    name: '',
    street: '',
    zip: '',
    city: '',
  },
})

// Colonnes du tableau, etc.
const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left' },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'factures', label: 'Facture', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const fetchClients = async () => {
  try {
    const { data } = await api.get('/eleves')
    for (let client of data) {
      try {
        // Récupérer les factures via le store
        await facturesStore.fetchFacturesByClient(client.id)
        // Ici, vous pouvez associer la première facture récupérée au client (ou gérer plusieurs)
        client.facture = facturesStore.factures.length > 0 ? facturesStore.factures[0] : null
      } catch {
        console.warn(`Aucune facture trouvée pour ${client.nom}`)
        client.facture = null
      }
    }
    clients.value = data
  } catch (error) {
    console.error('Erreur récupération clients :', error)
  }
}

const openModal = (client) => {
  form.value.clientId = client.id
  form.value.clientName = `${client.nom} ${client.prenom}`
  // Réinitialiser le formulaire
  form.value.amount = ''
  form.value.reference = ''
  form.value.invoiceNumber = ''
  form.value.date = ''
  form.value.creditor = { name: '', street: '', zip: '', city: '', account: '' }
  form.value.debtor = { name: `${client.nom} ${client.prenom}`, street: '', zip: '', city: '' }
  modalOpen.value = true
}

const generateFacture = async () => {
  // Vérification simple des champs obligatoires
  if (
    !form.value.clientId ||
    !form.value.amount ||
    !form.value.reference ||
    !form.value.invoiceNumber ||
    !form.value.date ||
    !form.value.clientName ||
    !form.value.creditor.name ||
    !form.value.creditor.street ||
    !form.value.creditor.zip ||
    !form.value.creditor.city ||
    !form.value.creditor.account ||
    !form.value.debtor.name ||
    !form.value.debtor.street ||
    !form.value.debtor.zip ||
    !form.value.debtor.city
  ) {
    console.error('Champs manquants pour générer la facture', form.value)
    return
  }
  try {
    const result = await facturesStore.generateFacture(form.value)
    modalOpen.value = false
    console.log('Facture générée :', result)
    // Rafraîchir la liste des clients pour mettre à jour les factures
    setTimeout(fetchClients, 1000)
  } catch (error) {
    console.error('Erreur génération facture :', error)
  }
}

const downloadInvoice = async (factureId) => {
  try {
    const response = await api.get(`/factures/download/${factureId}`, { responseType: 'blob' })
    if (!response.data) {
      console.error('Aucune donnée reçue pour la facture')
      return
    }
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `facture-${factureId}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Erreur téléchargement facture :', error)
  }
}

onMounted(fetchClients)
</script>
