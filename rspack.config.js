import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { VueLoaderPlugin } from 'vue-loader';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/main.ts',
  },
  resolve: {
    extensions: ['...', '.ts', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src'), // Alias para a pasta `src`
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          experimentalInlineMatchResource: true,
        },
      },
      {
        test: /\.(js|ts)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                },
              },
              env: { targets },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/, // Para suportar ambas as extensões .scss e .sass
        loader: 'sass-loader', // Usa o sass-loader
        type: 'css', // Configura o processamento como CSS
        options: {
          additionalData: `@import '@weni/unnnic-system/src/assets/scss/unnnic.scss';`, // Importa automaticamente o arquivo SCSS
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i, // Identifica os arquivos de imagem
        type: 'asset/resource', // Processa os arquivos como recursos
        generator: {
          filename: 'assets/images/[name][hash][ext]', // Define onde salvar os arquivos no build
        },
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    new rspack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': JSON.stringify(process.env),
      'import.meta.env': JSON.stringify({
        BASE_URL: process.env.BASE_URL || '/',
      }),
    }),
    new VueLoaderPlugin(),
  ],
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});
