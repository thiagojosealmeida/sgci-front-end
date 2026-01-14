const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'pessoas/form', component: () => import('pages/pessoas/CreateEditPessoa.vue') }
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
