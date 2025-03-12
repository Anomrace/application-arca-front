const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'eleves',
        component: () => import('pages/ElevesPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['student', 'admin'] },
      },
      {
        path: 'planning',
        component: () => import('pages/PlanningPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['student', 'admin', 'professor'] },
      },
      {
        path: 'factures',
        component: () => import('pages/FacturesPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['student', 'admin'] },
      },
      {
        path: 'professeurs',
        component: () => import('pages/ProfesseursPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]

export default routes
