const env = {
  dev: {
    APP_ENDPOINT: "http://localhost:1234"
  },
  prod: {
    APP_ENDPOINT: "https://api-jitome.ramda.io"
  }
};

module.exports = {
  env: process.env.NODE_ENV === "production" ? env.prod : env.dev
};
