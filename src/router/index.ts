import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Discovery from '@/views/Discovery.vue';
import IntegratedSolutions from '@/views/IntegratedSolutions.vue';
import { useAuthStore } from '@/stores/auth';

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
    {
      path: '/loginexternal/:token/:project/:flowOrg',
      name: 'externalLogin',
      redirect: '/',
      beforeEnter: async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
      ) => {
        const { token, project, flowOrg } = to.params as {
          token: string;
          project: string;
          flowOrg?: string;
        };

        await useAuthStore().externalLogin({ token: token.replace('+', ' ') });
        await useAuthStore().selectedProject({ project });

        if (flowOrg) {
          await useAuthStore().selectedFlowOrg({ flowOrg });
        } else {
          await useAuthStore().getFlowOrganization();
        }

        if (to.query.next) {
          next(to.query.next as string);
        } else {
          next('/');
        }
      },
    },
  ],
});

export default router;
