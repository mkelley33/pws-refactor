module.exports = {
  flags: {
    PRESERVE_WEBPACK_CACHE: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
  },
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
          },
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              terminal: `carbon`,
              lineNumbers: true,
              theme: `cobalt`,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `mkelley33`,
      },
    },
    `gatsby-plugin-tsconfig-paths`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `mkelley33`,
        short_name: `mkelley33`,
        description: `This is the personal web app of Michaux Kelley aka @mkelley33`,
        start_url: `/`,
        display: `standalone`,
        icon: `./icons/favicon-32x32.png`, // This path is relative to the root of the site.
        icons: [
          {
            src: `./icons/favicon-16x16.png`,
            sizes: `16x16 `,
            type: `image/png`,
          },
          {
            src: `./icons/apple-touch-icon.png`,
            type: `image/png`,
            sizes: `180x180`,
          },
          {
            src: `./icons/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `./icons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ], // Add or remove icon sizes as desired
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        // Accepts the following options, all of which are defined by `@emotion/babel-plugin` plugin.
        // The values for each key in this example are the defaults the plugin uses.
        sourceMap: true,
        autoLabel: `dev-only`,
        labelFormat: `[local]`,
        cssPropOptimization: true,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-mdx`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              // Use cacheFirst since these don't need to be revalidated (same RegExp
              // and same reason as above)
              urlPattern: /(\.js$|\.css$|static\/)/,
              handler: `CacheFirst`,
            },
            {
              // page-data.json files, static query results and app-data.json
              // are not content hashed
              urlPattern: /^https?:.*\/page-data\/.*\.json/,
              handler: `NetworkFirst`,
            },
            {
              // Add runtime caching of various other page resources
              urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
              handler: `StaleWhileRevalidate`,
            },
            {
              // Google Fonts CSS (doesn't end in .css so we need to specify it)
              urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
              handler: `StaleWhileRevalidate`,
            },
          ],
        },
      },
    },
  ],
  siteMetadata: {
    siteUrl: `https://pwsrefactordevelop.gatsbyjs.io`,
  },
};
