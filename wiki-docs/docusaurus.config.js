// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nextcloud CAD Viewer',
  tagline: 'DWG and DXF file viewing for Nextcloud',
  favicon: 'img/favicon.ico',

  url: 'https://ashcoft.github.io',
  baseUrl: '/nextcloud-cad-viewer/',
  organizationName: 'ashcoft',
  projectName: 'nextcloud-cad-viewer',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ashcoft/nextcloud-cad-viewer/tree/main/wiki-docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/ashcoft/nextcloud-cad-viewer/tree/main/wiki-docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'CAD Viewer',
        logo: {
          alt: 'Nextcloud CAD Viewer Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/ashcoft/nextcloud-cad-viewer',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/ashcoft/nextcloud-cad-viewer/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ashcoft/nextcloud-cad-viewer',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ashcoft. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
