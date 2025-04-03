module.exports = {
  apps: [{
    name: "sentinelle_api",
    script: "server.js",  // Adaptez à votre point d'entrée
    exec_mode: "fork",
    autorestart: true,
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      // DB_HOST: "${{ secrets.DB_HOST }}",  // À remplacer par vos variables
    },
  }]
};
  