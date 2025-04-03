module.exports = {
    apps: [{
      name: "api",
      script: "server.js",  // Adaptez à votre point d'entrée
      instances: "1",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // DB_HOST: "${{ secrets.DB_HOST }}",  // À remplacer par vos variables
      },
    }]
  };
  