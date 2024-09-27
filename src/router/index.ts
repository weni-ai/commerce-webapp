import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Discovery from '@/views/Discovery.vue';
import IntegratedSolutions from '@/views/IntegratedSolutions.vue';
import { useAuthStore } from '@/stores/auth';
import { i18n } from '@/locales';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/loginexternal/:token',
      name: 'externalLogin',
      component: {},
      beforeEnter: async (to, from, next) => {
        const { token } = to.params as {
          token: string;
        };
        const flowOrg = to.query.org_uuid as string;
        const project = to.query.project_uuid as string;
        // i18n.global.locale =
        //   {
        //     en: 'en-us',
        //   }[to.query.locale] || to.query.locale;
        await useAuthStore().externalLogin({ token: token.replace('+', ' ') });
        await useAuthStore().selectedProject({ project });

        if (flowOrg) {
          await useAuthStore().selectedFlowOrg({ flowOrg });
        } else {
          await useAuthStore().getFlowOrganization();
        }

        const nextPath = to.query.next as string;

        if (nextPath) {
          next({ path: nextPath, replace: true });
        } else {
          next({ path: '/', replace: true });
        }
      },
    },
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

router.afterEach(() => {
  window.parent.postMessage(
    {
      event: 'changePathname',
      pathname: window.location.pathname,
      moduleName: 'commerce',
    },
    '*',
  );
});

export default router;
