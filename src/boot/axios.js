import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // ⚡ Met ton backend ici (change en prod)
  headers: {
    'Content-Type': 'application/json',
  },
})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
