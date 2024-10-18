import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { UnnnicSystem } from '@/plugins/UnnnicSystem';
import { i18n } from './locales';
import { SentryInit } from '@/utils/SentryInit';

import App from './App.vue';
import router from './router';

const app = createApp(App);

SentryInit({ app });

app.use(i18n);
app.use(router);
app.use(createPinia());
app.use(UnnnicSystem);

app.mount('#app');
