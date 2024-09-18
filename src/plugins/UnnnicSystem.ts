import type { App, Component } from 'vue';

import Unnnic from '@weni/unnnic-system';
import '@weni/unnnic-system/dist/style.css';

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type ComponentMap = {
  [key: string]: Component;
};

const components: ComponentMap = {};

Unnnic.install({
  component(name: string, component: Component) {
    components[name] = component;
  },
});

export const UnnnicSystem = {
  install(app: App) {
    Object.keys(components).forEach((componentName) => {
      app.component(capitalize(componentName), components[componentName]);
    });
  },
};
