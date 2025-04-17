import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Discovery from '@/views/Discovery.vue';
import IntegratedSolutions from '@/views/IntegratedSolutions.vue';
import { useAuthStore } from '@/stores/Auth';
import { i18n } from '@/locales';
import { getJwtToken } from '@/plugins/jwt';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'externalLogin',
      component: {},
      beforeEnter: async (to, from, next) => {

        const { locale, project_uuid, set_api_base_url } = to.query as {
          locale: string;
          project_uuid: string;
          set_api_base_url?: string;
        };

        const authStore = useAuthStore();
        console.log('getJwtToken');
        await getJwtToken();
        console.log('getJwtToken done');
        const token = localStorage.getItem('authToken');
        console.log('token', token);
        if (!token) {
          console.log('no token');
          return next({ path: '/', replace: true });
        }
        
        authStore.setToken(token);
        authStore.setProjectUuid(project_uuid);

        if (import.meta.env.DEV) {
          localStorage.setItem(
            'dev:lastUsedLoginParams',
            JSON.stringify({
              token: token,
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
