import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Discovery from '@/views/Discovery.vue';
import IntegratedSolutions from '@/views/IntegratedSolutions.vue';
import { useAuthStore } from '@/stores/Auth';
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

        const { locale, project_uuid } = to.query as {
          locale: string;
          project_uuid: string;
        };

        const authStore = useAuthStore();

        authStore.setToken(token.replace('+', ' '));
        authStore.setProjectUuid(project_uuid);

        i18n.global.locale =
          {
            en: 'en-us',
          }[locale] || locale;

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
