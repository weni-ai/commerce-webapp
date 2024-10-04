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

        const tokenParsed = token.replace('+', ' ');

        const { locale, project_uuid, set_api_base_url } = to.query as {
          locale: string;
          project_uuid: string;
          set_api_base_url?: string;
        };

        const authStore = useAuthStore();

        authStore.setToken(tokenParsed);
        authStore.setProjectUuid(project_uuid);

        if (import.meta.env.DEV) {
          localStorage.setItem(
            'dev:lastUsedLoginParams',
            JSON.stringify({
              token: tokenParsed,
              locale,
              projectUuid: project_uuid,
            }),
          );

          if (set_api_base_url) {
            localStorage.setItem('dev:replaceAPIBaseURL', set_api_base_url);
          }
        }

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
