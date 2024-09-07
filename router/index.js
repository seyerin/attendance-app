import Vue from 'vue';
import Router from 'vue-router';
import FaceCamera from '@/components/FaceCamera.vue';
import FaceComparison from '@/components/FaceComparison.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/face-camera',
      name: 'FaceCamera',
      component: FaceCamera,
    },
    {
      path: '/face-comparison',
      name: 'FaceComparison',
      component: FaceComparison,
    },
    {
      path: '/',
      redirect: '/face-camera',
    },
  ],
});
