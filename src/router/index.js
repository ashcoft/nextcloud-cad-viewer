import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../App.vue'),
  },
  {
    path: '/view',
    name: 'Viewer',
    component: () => import('../App.vue'),
    props: (route) => ({
      fileId: route.query.fileIds || route.query.fileId || null,
    }),
  },
];

const router = createRouter({
  history: createWebHistory('/apps/cad_viewer/'),
  routes,
});

export default router;
