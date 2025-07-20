
import { cleanEnv, str, port, bool, num, url } from 'envalid';

const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'], desc: 'Environnement de Node.js' }),
    PORT: port({ default: 3000, desc: 'Port d’écoute du serveur' }),

    // Base de données
    DB_HOST: str({ desc: 'Hôte PostgreSQL' }),
    DB_USER: str({ desc: 'Utilisateur PostgreSQL' }),
    DB_PASSWORD: str({ desc: 'Mot de passe PostgreSQL' }),
    DB_NAME: str({ desc: 'Nom de la base de données' }),
    DB_DIALECT_ENCRYPTION: str({ choices: ['none', 'require'], default: 'none', desc: 'Encryption SSL : none|require' }),

    // Auth JWT
    JWT_SECRET: str({ desc: 'Clé secrète pour signer les JWT' }),
    JWT_EXPIRE_IN: num({ default: 24, desc: 'Durée de vie du JWT en heures' }),

    // SMTP (nodemailer)
    SMTP_USER: str({ desc: 'Utilisateur SMTP' }),
    SMTP_PASS: str({ desc: 'Mot de passe SMTP' }),
    SMTP_HOST: str({ default: 'smtp.gmail.com', desc: 'Hôte SMTP' }),
    SMTP_PORT: port({ default: 587, desc: 'Port SMTP' }),
    SMTP_SECURE: bool({ default: false, desc: 'Utiliser SSL/TLS pour SMTP' }),

    // Twilio
    TWILIO_ACCOUNT_SID: str({ desc: 'SID du compte Twilio' }),
    TWILIO_AUTH_TOKEN: str({ desc: 'Token d’authentification Twilio' }),
    TWILIO_PHONE_NUMBER: str({ desc: 'Numéro Twilio (format E.164)' }),

    // OTP
    OTP_TTL_MINUTES: num({ default: 15, desc: 'Durée de validité du code OTP en minutes' }),

    // CORS / Endpoints
    FRONTEND_ENDPOINT: url({ desc: 'URL de l’application front-end' }),
    BACKEND_ENDPOINT: url({ desc: 'URL de l’API back-end' }),
    E164_ENFORCE_PLUS: str({ choices: ['always', 'never'], default: 'always', desc: 'Règle d’ajout du + pour le format E.164' }),

    // APIs externes
    GEONAMES_URL: url({ default: 'https://secure.geonames.org', desc: 'Base URL Geonames' }),
    GEONAMES_USERNAME: str({ desc: 'Username Geonames' }),
    GEONAMES_TIMEOUT: num({ default: 5000, desc: 'Timeout Geonames en ms' }),

    RESCOUNTRIES_URL: url({ default: 'https://restcountries.com', desc: 'Base URL RestCountries' }),
    RESCOUNTRIES_TIMEOUT: num({ default: 5000, desc: 'Timeout RestCountries en ms' }),
});

export default env;
