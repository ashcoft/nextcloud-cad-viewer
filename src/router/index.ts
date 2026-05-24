import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../App.vue'),
  },
  {
    path: '/view',
    name: 'Viewer',
    component: () => import('../App.vue'),
    props: (route: RouteLocationNormalized) => ({
      fileId: route.query.fileIds ?? route.query.fileId ?? null,
    }),
  },
]

const router = createRouter({
  history: createWebHistory('/apps/nextcloud-cad-viewer/'),
  routes,
})

export default router
