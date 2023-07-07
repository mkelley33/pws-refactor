const path = require('path');

module.exports = {
  plugins: [
    'gatsby-plugin-tsconfig-paths',
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@components': path.resolve(__dirname, 'src/components'),
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'mkelley33',
        short_name: 'mkelley33',
        description:
          'This is the personal web app of Michaux Kelley aka @mkelley33',
        start_url: '/',
        display: 'standalone',
        icon: './icons/favicon-32x32.png', // This path is relative to the root of the site.
        icons: [
          {
            src: './icons/apple-touch-icon.png',
            type: 'image/png',
            sizes: '180x180',
          },
          {
            src: './icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ], // Add or remove icon sizes as desired
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/posts`,
      },
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-image',
    'gatsby-plugin-mdx',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-sharp',
  ],
};