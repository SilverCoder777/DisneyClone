# DisneyClone — Next.js

Application indépendante en français, inspirée de Disney+, avec Next.js App Router, React et TypeScript. Aucun streaming, abonnement ou compte Disney officiel.

## Fonctionnalités

- Inscription et connexion : mots de passe hachés avec scrypt et sel aléatoire, sessions opaques stockées hachées en base, cookies HttpOnly / SameSite / Secure en production, expiration à 7 jours et limitation des tentatives.
- Jusqu’à 7 profils par compte, avatars, suppression et sélection. Profil enfant limité aux titres classés 6 ans et moins dans ce catalogue.
- Catalogue, recherche, univers, films et séries, fiches de titres et favoris persistants par profil.
- Contrôle serveur de la propriété des profils et des favoris. Mutations par Server Actions avec vérification d’origine fournie par Next.js.
- Pages compte, erreurs et chargement, interface responsive.

## Démarrer

Node.js 24+ requis pour le module SQLite natif.

```sh
npm ci
npm run dev -- --port 5173
```

```sh
npm test
npm run build
npm start -- --port 3000
```

SQLite initialise automatiquement `.data/app.sqlite` et utilise WAL avec clés étrangères. Ce répertoire contient les comptes, sessions, profils et favoris : ne pas le publier dans Git. `DATA_DIR` peut pointer vers un volume persistant accessible en écriture. Sauvegarder la base à l’aide d’un outil SQLite compatible et conserver les sauvegardes hors du dépôt.

## Déploiement

Prévoir Node.js 24, HTTPS et un disque persistant. Cette version cible une instance serveur ; pour plusieurs instances ou un hébergement sans disque persistant, migrer vers PostgreSQL et une limitation des tentatives distribuée. Les cookies de connexion en production nécessitent HTTPS. Les illustrations SVG originales sont servies localement : aucun chargement d’images ou de polices externe n’est nécessaire. Ce ne sont pas les affiches officielles des œuvres.

Avant ouverture publique : validation des e-mails, récupération de compte, politique de confidentialité, supervision et sauvegardes. Le filtre enfant est un filtre de catalogue de démonstration, sans verrou parental par code PIN. Aucune connexion OAuth ni envoi d’e-mail n’est configuré.

## Tests navigateur

Un Chromium installé est nécessaire (chemin configurable avec `CHROMIUM_PATH`). Démarrer un serveur de développement sur un répertoire de données de test :

```sh
DATA_DIR=/tmp/disneyclone-e2e npm run dev -- --port 5174
TEST_BASE_URL=http://localhost:5174 npm run test:e2e
```

Le scénario crée des comptes de test et vérifie les pages protégées, l’inscription, la connexion, la recherche, les favoris persistants, les profils enfants et l’affichage mobile. Ne pas exécuter contre une instance publique ou des données de production.
