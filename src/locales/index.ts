import { createI18n } from 'vue-i18n';

import m from './messages.json';

const languages = ['pt-br', 'en-us', 'es'];

function searchFor(language: string, object: object) {
  if (typeof object[language] === 'string') {
    return object[language];
  }

  return Object.entries(object)
    .map(([key, value]) => ({
      [key]: searchFor(language, value),
    }))
    .reduce(
      (previous, current) => ({
        ...previous,
        ...current,
      }),
      {},
    );
}

export const i18n = createI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: languages
    .map((language) => ({
      [language]: searchFor(language, m),
    }))
    .reduce((previous, current) => ({ ...previous, ...current })),
});
