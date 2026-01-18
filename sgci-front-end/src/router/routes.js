const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'pessoas/form', name:"CreatePessoa", component: () => import('pages/pessoas/CreateEditPessoa.vue') },
      { path: 'pessoas/form/:id', name: 'CreateEditPessoa', component: () => import('pages/pessoas/CreateEditPessoa.vue') },
      { path: 'pessoas/view/:id', name: 'ViewPessoa', component: () => import('pages/pessoas/ViewPessoa.vue') },
      { path: 'pessoas', name: 'GridPessoa', component: () => import('pages/pessoas/GridPessoa.vue') }
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
