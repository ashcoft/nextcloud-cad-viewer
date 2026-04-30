import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/view/:fileId',
    name: 'Viewer',
    component: () => import('../App.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
