# projet_sentinelle_back

API backent du projet sentinelle

# Naming convention:

Files : kebab-case (user.controller.js, error-handler.middleware.js)
Folders : kebab-case (config, services)
Variables & fonctions : camelCase (getUserById, validateEnv)
Classes & models : PascalCase (User, PrayerSubject)
Express Routes : utiliser le pluriel (/users, /subjects), HTTP verbs explicites

# How to run the Backend API

- clone the project, assuming your familiar with git tools and commands:
  hhtps command: https://github.com/Ibikivan/projet_sentinelle_back.git
  ssh command: git@github.com:Ibikivan/projet_sentinelle_back.git

- Install dependances with the following command:
  for yarn users: yarn install
  for npm users: npm install

- then take a break and configure envs variables with the following values:

  DB_HOST=database_host
  DB_USER=database_user
  DB_PASSWORD=database_password
  DB_NAME=database_name
  DB_DIALECT_ENCRYPTION=database_dialect_encryption # none | ssl | tls
  PORT=database_port

  # Node environnement

  NODE_ENV=node_environment # development | production | test

  # JWT secret

  JWT_SECRET=your_jwt_secret_key
  JWT_EXPIRE_IN=jwt_key_expiration_time_in_hour # e.g., 24, 48

  # Mail configuration

  SMTP_USER=your_mail_user
  SMTP_PASS=your_mail_password
  SMTP_HOST=your_mail_host
  SMTP_PORT=smtp_port
  SMTP_SECURE=smpt_sucure_value # true | false

  # SMS configuration

  TWILIO_ACCOUNT_SID=your_twilio_account_sid
  TWILIO_AUTH_TOKEN=you_twilio_auth_token
  TWILIO_PHONE_NUMBER=twilio_phone_number # E.164 format, e.g., +1234567890

  # Otp delay config

  OTP_TTL_MINUTES=otp_time_to_live_in_minutes # e.g., 10

  # Origin

  FRONTEND_ENDPOINT=frontend_env_endpoint
  BACKEND_ENDPOINT=backend_env_endpoint

  # Phone number format

  # Toujours préfixer

  E164_ENFORCE_PLUS=enforcement_value # always | never | auto

  # always (always add the "+" prefixe)

  # never (always remove the "+" prefixe)

  # auto (let the user decide)

  GEONAMES_URL=geoname_url # e.g., https://secure.geonames.org
  GEONAMES_USERNAME=geoname_username
  GEONAMES_TIMEOUT=timeout_value_in_milliseconds # e.g., 60000

  RESCOUNTRIES_URL=rescountries_url # e.g., https://restcountries.com
  RESCOUNTRIES_TIMEOUT=timeout_value_in_milliseconds # e.g., 60000

  BIGDATACLOUD_URL=bigdatacloud_url # e.g., https://api-bdc.io
  BIGDATACLOUD_TIMEOUT=timeout_value_in_milliseconds # e.g., 6000

  MAX_UPLOADS_FILES_SIZE=multer_max_upload_file_size_in_megabytes # e.g., 10 (10MB)

- Env variable config:
  The app will fail to start untill you provide all env variable, and an error message show which one is missing will promp in the terminal.
  Refer to it to efficiently debug.

- After provide all env needs value start the API first time:
  make sure for this first launch the database sync file here:

  ## ./projet_sentinelle_back/src/model/index.js

  is configured with

  ## sync({ alter: true }).

  if not, make changes in the file by yourself.
  and run the command:

  ## yarn run dev # In dev env

  ## yarn run start # In production

  Adapt the command dépending on the package manager you chose

  after the first launch, remove the alter: true value and leave

  ## sync()

  NB: be aware that the if you live the alter: true config you will expérience bugs after emplementing vectorial search field migration on the next steps. if you will not need that functionanlity, just skip the related step and you can keep alter: true config.

- Provide config.json file data:
  For successfully launch seeding and migration without Node env from node js, you need to provide data access informations from the config.json file in:

  ## ./projet_sentinelle_back/config/config.json

  {
  "development": {
  "username": "…",
  "password": "…",
  "database": "nom_de_ta_db_dev",
  "host": "127.0.0.1",
  "dialect": "postgres"
  },
  "test": {
  "username": "…",
  "password": "…",
  "database": "nom_de_ta_db_test",
  "host": "127.0.0.1",
  "dialect": "postgres"
  },
  "production": {
  "username": "…",
  "password": "…",
  "database": "nom_de_ta_db_prod",
  "host": "127.0.0.1",
  "dialect": "postgres",
  "dialectOptions": {
  "ssl": {
  "require": true,
  "rejectUnauthorized": false
  }
  }
  }
  }

  you have to provide database access informations for the environment you are launching for.

- After that tricky part down the server and run seeding command:
  the seeding command will précharge cities table with 5000 cities with the free account from the geoname api database.
  run the following command to seed

  ## yarn run seed:all

  ## yarn run seed:all:prod

  the seeding will end successfully by an error message "GeoNames malformed or error response"; dont worry everything is okay.

  any other error is the result of an issue while seeding.
  it's recommended to verify yo have a good fast connexion before seeding to avoid geoname's timeout issues.

- Launch auto generate vectorial search field file from cities migration:
  run the command:

  ## yarn run migrate:all

  ## yarn run migrate:all:prod

  - Notice this functionality will interfer with sequelize automatic sync { alter: true } or { alter: force } if you didn't disabled it like shown on the firt launch step.
  - A standard Ilike type search functionality is already implemented so you can skeep this step if you not necessary need fullText search.
  - You can undo this migratio by using the command:

  ## yarn run undo:migrate

  ## yarn run undo:migrate:prod

- Now launch the server and enjoy !!
  You can now lauch the server using start or dev script:
  - Notice the app native embed PM2 script support with the ecoystem file:
  ## ./projet_sentinelle_back/ecosystem.config.js
  that allow to lauch production server using the commande:
  ## pm2 start ecosystem.config.js --env production
  or developpement server with the command:
  ## pm2 start ecosystem.config.js
  or
  ## pm2 restart sentinelle_api --env development
