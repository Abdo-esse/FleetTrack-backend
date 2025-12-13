# Tests Unitaires - Authentication

Ce dossier contient les tests unitaires pour les fonctions d'authentification du backend FleetTrack.

## Structure

```
tests/unit/
├── auth.controller.test.js  # Tests du contrôleur auth (12 tests)
├── auth.service.test.js     # Tests du service auth (11 tests)
└── setup.js                 # Configuration minimale pour les tests unitaires
```

## Exécution des Tests

### Tests Unitaires Uniquement

```bash
# Exécuter tous les tests unitaires
npm run test:unit

# Exécuter en mode watch (re-run automatique quand les fichiers changent)
npm run test:unit:watch

# Exécuter avec rapport de couverture
npm run test:unit:coverage
```

### Tous les Tests (Unitaires + Intégration)

```bash
# Exécuter tous les tests
npm test

# Avec couverture
npm run test:coverage
```

## Couverture des Tests

### Auth Service (`src/services/auth.js`)
- ✅ `register` - Création de compte utilisateur
- ✅ `login` - Connexion et génération de tokens
- ✅ `refresh` - Renouvellement du token d'accès
- ✅ `logout` - Déconnexion et suppression du refresh token

### Auth Controller (`src/controllers/auth.js`)
- ✅ `login` - Endpoint POST /api/auth/login
- ✅ `register` - Endpoint POST /api/auth/register
- ✅ `logout` - Endpoint POST /api/auth/logout
- ✅ `refresh` - Endpoint POST /api/auth/refresh
- ✅ `getProfile` - Endpoint GET /api/auth/profile

## Résultats des Tests

```
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total
Time:        ~3.2s
```

## Caractéristiques des Tests Unitaires

1. **Isolation Complète**: Tous les dépendances externes sont mockées
   - Modèle User
   - Fonctions de hash/comparaison de mots de passe
   - Génération et vérification de tokens JWT

2. **Pas de Base de Données**: Les tests unitaires n'utilisent pas MongoDB
   - Tests rapides (< 4 secondes)
   - Pas besoin de MongoMemoryServer
   - Aucune configuration de base de données requise

3. **Couverture Complète**:
   - Cas de succès (happy path)
   - Gestion des erreurs
   - Cas limites (missing data, invalid tokens, etc.)

## Ajouter de Nouveaux Tests Unitaires

1. Créer un nouveau fichier `tests/unit/[feature].test.js`
2. Importer les fonctions à tester
3. Mocker les dépendances avec `jest.mock()`
4. Écrire les tests avec `describe()` et `it()`

Exemple:

```javascript
import * as myService from '../../src/services/myService.js';
import Model from '../../src/models/model.js';

jest.mock('../../src/models/model.js');

describe('My Service', () => {
  it('should do something', async () => {
    Model.findOne.mockResolvedValue({ id: '123' });
    const result = await myService.doSomething();
    expect(result).toBeDefined();
  });
});
```

## Documentation

Voir [walkthrough.md](file:///C:/Users/Youcode/.gemini/antigravity/brain/69b864e2-47c3-4d3e-ac13-a1d701dbc412/walkthrough.md) pour plus de détails sur:
- Configuration Jest
- Patterns de test utilisés
- Rapport de couverture détaillé
