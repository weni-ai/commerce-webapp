import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { auth_store } from '@/stores/auth';
import getEnv from '@/utils/env';

export default {
  get $http(): AxiosInstance {
    const authStore = auth_store();

    const client = axios.create({
      baseURL: getEnv('VITE_APP_API_BASE_URL'),
      headers: {
        ...(authStore.authenticated
          ? {
              Authorization: `${authStore.token}`,
              'Project-Uuid': `${authStore.project}`,
            }
          : {}),
      },
    });

    client.interceptors.response.use(undefined, (error) => {
      return Promise.reject(error);
    });

    return client;
  },
};
