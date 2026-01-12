# Sentinelle API - Réseau Social de Prière

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-orange.svg)](https://sequelize.org/)

API backend pour **Sentinelle**, une plateforme de réseau social dédiée à la prière et l'intercession communautaire.

## 🎯 Fonctionnalités

### Authentification & Utilisateurs

- Authentification JWT via cookies HttpOnly
- Gestion OTP (SMS/Email) pour réinitialisation mot de passe
- Changement de numéro de téléphone sécurisé
- Rôles : `USER`, `ADMIN`, `SUPER_ADMIN`

### Sujets de Prière

- CRUD complet des sujets de prière
- Visibilité : Public / Privé
- États : Actif, Clôturé (Exaucé), Clôturé (Expiré)
- Association avec groupes et communautés

### Sessions de Prière

- Démarrage/Fin de sessions avec géolocalisation
- Suivi par ville, pays, continent
- Statistiques de prière par sujet

### Groupes (PrayerCrew) & Communautés

- Gestion des membres avec rôles (Admin, Modérateur, Membre)
- Statuts d'adhésion (En attente, Accepté, Banni)
- Hiérarchie : Communauté → Groupes → Membres

### Témoignages & Partages

- Témoignages liés aux sujets exaucés
- Partages texte et audio sur les sujets

## 🏗️ Architecture

```
src/
├── config/          # Configuration (DB, environnement)
├── controllers/     # Contrôleurs HTTP (7 modules)
├── middlewares/     # Auth, Validation, Error handling
├── model/           # Modèles Sequelize (12 entités)
├── repositories/    # Couche d'accès aux données
├── routes/          # Définition des routes Express
├── services/        # Logique métier
├── utils/           # Utilitaires (logger, query builder)
└── validators/      # Schémas Joi de validation
```

### Stack Technique

- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **ORM**: Sequelize 6
- **Base de données**: PostgreSQL 15+
- **Validation**: Joi 18
- **Logging**: Pino
- **Documentation**: Swagger/OpenAPI

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/Ibikivan/projet_sentinelle_back.git
cd projet_sentinelle_back

# Installer les dépendances
yarn install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

## ⚙️ Configuration

Voir [STARTUP.md](./STARTUP.md) pour le guide de configuration complet.

Variables d'environnement requises :

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRE_IN`
- `BACKEND_ENDPOINT`, `FRONTEND_ENDPOINT`

## 🚀 Démarrage

```bash
# Mode développement (avec hot-reload)
yarn dev

# Mode production
yarn start

# Exécuter les seeders
yarn seed:all
```

## 📚 Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger :

```
http://localhost:7000/api/docs
```

## 🧪 Tests

```bash
# Exécuter les tests (à implémenter)
yarn test
```

## 📁 Entités Principales

| Entité             | Description                               |
| ------------------ | ----------------------------------------- |
| `User`             | Utilisateurs de la plateforme             |
| `PrayerSubject`    | Sujets de prière                          |
| `PrayerCrew`       | Groupes d'intercession                    |
| `Community`        | Communautés regroupant groupes et membres |
| `PrayerSession`    | Sessions de prière avec géolocalisation   |
| `Testimony`        | Témoignages d'exaucement                  |
| `Sharing`          | Commentaires texte/audio                  |
| `PrayerCrewMember` | Adhésion User ↔ Groupe (N:M)              |
| `CommunityMember`  | Adhésion User ↔ Communauté (N:M)          |

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- JWT stocké en cookie HttpOnly avec SameSite
- Revocation de tokens via `tokenRevokedBefore`
- Validation des entrées avec Joi
- Protection CORS configurée

## 📄 Licence

ISC - Voir [LICENSE](./LICENSE)

## 👤 Auteur

**@ibikivan** - [GitHub](https://github.com/Ibikivan)
