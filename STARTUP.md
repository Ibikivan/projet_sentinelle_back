# Guide de Démarrage - Sentinelle API

Ce guide détaille la configuration et le démarrage de l'API Sentinelle.

## Prérequis

- **Node.js** 18.x ou supérieur
- **Yarn** 1.22.x ou supérieur
- **PostgreSQL** 15.x ou supérieur
- **Git**

## 1. Installation

```bash
# Cloner le repository
git clone https://github.com/Ibikivan/projet_sentinelle_back.git
cd projet_sentinelle_back

# Installer les dépendances
yarn install
```

## 2. Configuration de la Base de Données

### Créer la base de données PostgreSQL

```sql
CREATE DATABASE sentinelle_db;
CREATE USER sentinelle_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sentinelle_db TO sentinelle_user;
```

## 3. Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

### Variables Requises

```env
# Environnement
NODE_ENV=development

# Base de données PostgreSQL
DB_HOST=localhost
DB_USER=sentinelle_user
DB_PASSWORD=your_password
DB_NAME=sentinelle_db
DB_DIALECT_ENCRYPTION=   # 'ssl' pour connexions sécurisées

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE_IN=24  # Heures

# URLs
BACKEND_ENDPOINT=http://localhost:7000
FRONTEND_ENDPOINT=http://localhost:3000

# OTP
OTP_TTL_MINUTES=15

# Formatage téléphone
E164_ENFORCE_PLUS=always  # 'always', 'never', 'auto'

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Twilio SMS (optionnel)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Admin initial (pour seeder)
ADMIN_EMAIL=admin@sentinelle.app
ADMIN_PHONE_NUMBER=+237600000000
ADMIN_DEFAULT_PASSWORD=Admin123!

# Logging
LOG_LEVEL=info  # 'debug', 'info', 'warn', 'error'
```

## 4. Synchronisation de la Base de Données

L'application synchronise automatiquement les modèles au démarrage via `sequelize.sync()`.

> ⚠️ **Important**: En développement, vous pouvez vider la base et laisser Sequelize recréer les tables. En production, utilisez les migrations.

## 5. Seeders

### Créer l'administrateur initial

```bash
yarn seed:all
```

Cela crée un utilisateur admin avec les credentials définis dans `.env`.

### Seeder les villes (GeoNames)

```bash
yarn seed:all
```

## 6. Démarrage

### Mode Développement

```bash
yarn dev
```

Le serveur démarre sur `http://localhost:7000` avec hot-reload (nodemon).

### Mode Production

```bash
yarn start
```

### Avec PM2

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Voir les logs
pm2 logs sentinelle-api
```

## 7. Vérification

### Tester la connexion

```bash
curl http://localhost:7000/api/cities?limit=5
```

### Accéder à la documentation

Ouvrez dans votre navigateur :

```
http://localhost:7000/api/docs
```

## 8. Structure des Endpoints

| Préfixe               | Description                           |
| --------------------- | ------------------------------------- |
| `/api/auth`           | Authentification (login, logout, OTP) |
| `/api/users`          | Gestion des utilisateurs              |
| `/api/subjects`       | Sujets de prière                      |
| `/api/prayer-session` | Sessions de prière                    |
| `/api/testimonies`    | Témoignages                           |
| `/api/sharings`       | Partages/Commentaires                 |
| `/api/cities`         | Villes (géolocalisation)              |

## 9. Dépannage

### Erreur de connexion DB

Vérifiez que PostgreSQL est démarré et que les credentials sont corrects dans `.env`.

```bash
# Tester la connexion PostgreSQL
psql -h localhost -U sentinelle_user -d sentinelle_db
```

### Port déjà utilisé

```bash
# Windows - Trouver le processus sur le port 7000
netstat -ano | findstr :7000

# Tuer le processus
taskkill /PID <PID> /F
```

### Problèmes de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules yarn.lock
yarn install
```

## 10. Scripts Disponibles

| Script                | Description                          |
| --------------------- | ------------------------------------ |
| `yarn dev`            | Démarrage développement avec nodemon |
| `yarn start`          | Démarrage production                 |
| `yarn seed:all`       | Exécuter tous les seeders            |
| `yarn migrate:all`    | Exécuter les migrations              |
| `yarn lint`           | Vérifier le code avec ESLint         |
| `yarn format`         | Formater le code avec Prettier       |
| `yarn swagger:export` | Exporter la doc Swagger en JSON      |
