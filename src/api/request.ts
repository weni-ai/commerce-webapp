import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/Auth';
import getEnv from '@/utils/env';

export default {
  get $http(): AxiosInstance {
    const authStore = useAuthStore();

    let baseURL = getEnv('API_BASE_URL');

    if (import.meta.env.DEV) {
      const replaceAPIBaseURL = localStorage.getItem('dev:replaceAPIBaseURL');

      if (replaceAPIBaseURL) {
        baseURL = replaceAPIBaseURL;
      }
    }

    const client = axios.create({
      baseURL,
      headers: {
        Authorization: authStore.token,
      },
    });

    return client;
  },
};
