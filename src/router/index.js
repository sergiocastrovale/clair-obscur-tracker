import { createRouter, createWebHistory } from 'vue-router';
import Map from '../components/Map.vue';
import MapDebug from '../components/MapDebug.vue';

const routes = [
  {
    path: '/',
    component: Map
  },
  {
    path: '/map-debug',
    name: 'MapDebug',
    component: MapDebug
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
});

export default router;
