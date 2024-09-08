import { createRouter, createWebHistory } from 'vue-router';
import FaceComparisonPage from '@/pages/FaceComparisonPage.vue'; 
import FaceCameraPage from '@/pages/FaceCameraPage.vue'; 

const routes = [
  {
    path: '/face-comparison',
    name: 'FaceComparison',
    component: FaceComparisonPage,
  },
  {
    path: '/face-camera',
    name: 'FaceCamera',
    component: FaceCameraPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
