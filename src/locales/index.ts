import { createI18n } from 'vue-i18n';

import enUS from './en-US.json';
import ptBR from './pt-BR.json';
import esES from './es-ES.json';

export const i18n = createI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: {
    'en-us': enUS,
    'pt-br': ptBR,
    es: esES,
  },
});
