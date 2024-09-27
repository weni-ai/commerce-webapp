import { createI18n } from 'vue-i18n';
import { flattenDeep } from 'lodash';

import messages from './messages.json';

const languages = ['pt-br', 'en-us', 'es'];

function transformMessages(b, prefix = []) {
  if (typeof b === 'string') {
    return { [prefix.join('.')]: b };
  }

  return Object.entries(b).map(([key, value]) =>
    transformMessages(value, prefix.concat(key)),
  );
}

const allMessages = flattenDeep(transformMessages(messages)).reduce(
  (previous, current) => ({
    ...previous,
    ...current,
  }),
  {},
);

export const i18n = createI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: Object.fromEntries(
    languages.map((language) => [
      language,
      Object.fromEntries(
        Object.keys(allMessages)
          .filter((key) => key.endsWith(`.${language}`))
          .map((current) => [
            current.slice(0, -`.${language}`.length),
            allMessages[current],
          ]),
      ),
    ]),
  ),
});
