// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  // webpack: {
  //   jsLoader: (isServer) => ({
  //     loader: require.resolve('esbuild-loader'),
  //     options: {
  //       loader: 'tsx',
  //       format: isServer ? 'cjs' : undefined,
  //       target: isServer ? 'node12' : 'es2017',
  //     },
  //   }),
  // },
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          target: 'es2017',
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },

  plugins: [
    require.resolve("@cmfcmf/docusaurus-search-local"),
  ],
  title: '@fastly/js-compute',
  tagline: 'Javascript SDK and CLI for Fastly Compute@Edge',
  url: 'https://js-compute-reference-docs.edgecompute.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  // favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'fastly', // Usually your GitHub org/user name.
  projectName: 'js-compute-runtime', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          includeCurrentVersion: false,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },

      }),
    ],
  ],

  staticDirectories: ['static'],

  scripts: [
    '/fiddle.js',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '@fastly/js-compute',
        items: [
          {
            type: 'docsVersionDropdown',
          },
          {href: 'https://developer.fastly.com/', label: 'Fastly Developer Hub', position: 'left'},
          {href: 'https://developer.fastly.com/solutions/examples/javascript/', label: 'Code Examples', position: 'left'},
          {href: 'https://fiddle.fastly.dev', label: 'Fastly Fiddle', position: 'left'},
          {
            href: 'https://twitter.com/FastlyDevs/',
            label: 'Twitter',
            position: 'right',
          },
          {
            href: 'https://github.com/fastly/js-compute-runtime/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Fastly Inc. All rights reserved. Portions of this content are ©1998–2022 by individual mozilla.org contributors. Content available under a <a href="https://creativecommons.org/licenses/by-sa/2.5/">CC-BY-SA 2.5</a> license.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;