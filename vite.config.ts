import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';
import path from 'path';

export default defineConfig(async () => {
  return {
    base: 'http://localhost:3001',
    plugins: [
      federation({
        filename: 'remoteEntry.js',
        name: 'remote',
        exposes: {
          './remote-app': './src/components/Prototype.vue',
        },
        remotes: {},
      }),
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        vue: path.resolve(
          __dirname,
          './node_modules/vue/dist/vue.runtime.esm-bundler.js',
        ),
      },
    },
    build: {
      target: 'chrome89',
    },
    define: {
      __APP_NAME__: JSON.stringify(process.env.npm_package_name),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@weni/unnnic-system/src/assets/scss/unnnic.scss';`,
        },
      },
    },
  };
});
