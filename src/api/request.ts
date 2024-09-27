import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/Auth';
import getEnv from '@/utils/env';

export default {
  get $http(): AxiosInstance {
    const authStore = useAuthStore();

    const client = axios.create({
      baseURL: getEnv('VITE_APP_API_BASE_URL'),
      headers: {
        ...(authStore.token
          ? {
              Authorization: `${authStore.token}`,
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
