import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import HtmlRspackPlugin from 'html-rspack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import pkg from './package.json' assert { type: 'json' };

dotenv.config();

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  mode: process.env.NODE_ENV,
  context: __dirname,
  devServer: {
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    compress: true,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: `${process.env.PUBLIC_PATH_URL}`,
    filename: 'assets/js/[name]-[contenthash].js',
    chunkFilename: 'assets/js/[name]-[contenthash].js',
    assetModuleFilename: 'assets/[name]-[hash][ext]',
  },
  entry: {
    main: './src/main.ts',
  },
  resolve: {
    extensions: ['...', '.ts', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src'),
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
        test: /\.(scss|sass)$/,
        loader: 'sass-loader',
        type: 'css',
        options: {
          additionalData: `@import '@weni/unnnic-system/src/assets/scss/unnnic.scss';`,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name]-[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './index.html',
      minify: {
        removeComments: false,
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeAttributeQuotes: false,
      },
    }),
    new rspack.DefinePlugin({
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_VERSION__: JSON.stringify(pkg.version),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': JSON.stringify(process.env),
      'import.meta.env': JSON.stringify({
        BASE_URL: process.env.BASE_URL || '/',
        DEV: process.env.NODE_ENV === 'development' ? true : false,
      }),
    }),
    new VueLoaderPlugin(),
    new rspack.container.ModuleFederationPlugin({
      name: 'commerce',
      filename: 'remoteEntry.js',
      exposes: {
        './solution-card': './src/views/Discovery.vue',
        './locales/pt_br': './src/locales/pt-BR.json',
        './locales/en_us': './src/locales/en-US.json',
        './locales/es_es': './src/locales/es-ES.json',
      },
      remotes: {
        connect: `connect@${process.env.MODULE_FEDERATION_CONNECT_URL}/remoteEntry.js`,
      },
      shared: {
        ...pkg,
        vue: {
          singleton: true,
          eager: true,
        },
        'vue-i18n': {
          singleton: true,
          requiredVersion: pkg.dependencies['vue-i18n'],
          eager: true,
        },
        pinia: {
          singleton: true,
          requiredVersion: pkg.dependencies['pinia'],
          eager: true,
        },
      },
    }),
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
