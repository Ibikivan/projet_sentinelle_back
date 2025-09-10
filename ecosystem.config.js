module.exports = {
  apps: [{
    name: "sentinelle_api",
    script: "server.js",
    exec_mode: "fork",
    autorestart: true,
    env: {
      NODE_ENV: "development",
      PORT: 3000,
      // DB_HOST: "${{ secrets.DB_HOST }}",  // À remplacer par vos variables
    },
    env_test: {
      NODE_ENV: "test",
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000,
    },
  }]
};
