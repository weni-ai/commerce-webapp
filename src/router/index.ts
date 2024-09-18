import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Discovery from '@/views/Discovery.vue';
import IntegratedSolutions from '@/views/IntegratedSolutions.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: { name: 'discovery' },
      children: [
        {
          path: 'discovery',
          name: 'discovery',
          component: Discovery,
        },
        {
          path: 'integrated-solutions',
          name: 'integrated-solutions',
          component: IntegratedSolutions,
        },
      ],
    },
  ],
});

export default router;
