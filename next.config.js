const withOffline = require("next-offline");

const env = {
  dev: {
    APP_ENDPOINT: "http://localhost:1234"
  },
  prod: {
    APP_ENDPOINT: "https://api-jitome.ramda.io"
  }
};

module.exports = withOffline({
  target: "serverless",
  transformManifest: manifest => ["/"].concat(manifest),
  generateInDevMode: true,
  workboxOpts: {
    swDest: "static/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "https-calls",
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
  env: process.env.NODE_ENV === "production" ? env.prod : env.dev
});
