import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useUserStore } from 'src/stores/user' // Assurez-vous que le chemin correspond à votre projet

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Ajout d'une garde globale de navigation
  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    console.log('=== Router Guard ===')
    console.log('User connecté :', userStore.user)
    console.log('Route demandée :', to.path)
    console.log('Meta de la route :', to.meta)

    if (requiresAuth && !userStore.isAuthenticated()) {
      // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
      next({ path: '/login' })
    } else if (requiresAuth && to.meta.allowedRoles) {
      // Vérifier que l'utilisateur a un rôle autorisé pour accéder à la route
      if (userStore.hasRole(to.meta.allowedRoles)) {
        next()
      } else {
        // Si l'utilisateur n'a pas le rôle requis, rediriger (par exemple vers la page d'accueil)
        next({ path: '/' })
      }
    } else {
      next()
    }
  })

  return Router
})
