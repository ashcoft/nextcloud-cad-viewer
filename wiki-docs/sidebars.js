// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Installation',
      items: ['installation/app-store', 'installation/manual'],
    },
    {
      type: 'category',
      label: 'Features',
      items: ['features/overview', 'features/controls', 'features/fullscreen'],
    },
    {
      type: 'category',
      label: 'Development',
      items: ['development/setup', 'development/build', 'development/testing'],
    },
    {
      type: 'category',
      label: 'Compatibility',
      items: ['compatibility/requirements', 'compatibility/file-formats'],
    },
    'troubleshooting',
    'contributing',
  ],
};

module.exports = sidebars;
