# 🧪 Guide de Tests API avec Postman

## 📥 Configuration Initiale

### 1. Créer un Environnement Postman

**Nom:** `Gestion Chantiers - Production`

**Variables:**
| Variable | Type | Valeur Initiale | Valeur Actuelle |
|----------|------|----------------|-----------------|
| `base_url` | default | `https://gestion-chantier-backend.onrender.com/api` | - |
| `token` | secret | - | (Auto-rempli après login) |
| `user_id` | default | - | (Auto-rempli après login) |

### 2. Créer une Collection

**Nom:** `Gestion Chantiers Kenia`

**Pre-request Script (Collection level):**
```javascript
// Optionnel: Rafraîchir le token si expiré
```

**Tests (Collection level):**
```javascript
// Vérifier que la réponse est en JSON
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Vérifier le temps de réponse
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

---

## 🔐 Tests d'Authentification

### Test 1: Health Check
**Méthode:** `GET`  
**URL:** `{{base_url}}/health`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("API is running", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.message).to.eql("API is running");
});
```

---

### Test 2: Créer un Compte Admin
**Méthode:** `POST`  
**URL:** `{{base_url}}/auth/register`

**Body (JSON):**
```json
{
  "nom": "Admin Principal",
  "email": "admin@chantier.com",
  "password": "Admin123!",
  "role": "admin",
  "telephone": "+243999999999"
}
```

**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("User created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.user).to.have.property('id');
    pm.expect(jsonData.user.role).to.eql('admin');
});
```

---

### Test 3: Login (Connexion)
**Méthode:** `POST`  
**URL:** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "email": "admin@chantier.com",
  "password": "Admin123!"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.token).to.be.a('string');
    
    // Sauvegarder le token dans les variables d'environnement
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
});
```

---

### Test 4: Obtenir le Profil
**Méthode:** `GET`  
**URL:** `{{base_url}}/auth/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Profile retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.user.email).to.eql("admin@chantier.com");
});
```

---

## 👥 Tests de Gestion des Utilisateurs

### Test 5: Créer un Chef de Chantier
**Méthode:** `POST`  
**URL:** `{{base_url}}/users`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "nom": "Jean Dupont",
  "email": "chef1@chantier.com",
  "password": "Chef123!",
  "role": "chef",
  "telephone": "+243888888888"
}
```

**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Chef created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("chef_id", jsonData.user.id);
});
```

---

### Test 6: Créer des Ouvriers
**Méthode:** `POST`  
**URL:** `{{base_url}}/users`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "nom": "Pierre Martin",
  "email": "ouvrier1@chantier.com",
  "password": "Ouvrier123!",
  "role": "ouvrier",
  "telephone": "+243777777777"
}
```

**Tests:**
```javascript
pm.test("Ouvrier created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.user.role).to.eql("ouvrier");
    pm.environment.set("ouvrier1_id", jsonData.user.id);
});
```

---

### Test 7: Lister les Utilisateurs
**Méthode:** `GET`  
**URL:** `{{base_url}}/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Users list retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.users).to.be.an('array');
    pm.expect(jsonData.pagination).to.have.property('total');
});
```

---

## 🏗️ Tests de Gestion des Chantiers

### Test 8: Créer un Chantier
**Méthode:** `POST`  
**URL:** `{{base_url}}/chantiers`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "nom": "Construction Immeuble ABC",
  "description": "Construction d'un immeuble de 5 étages",
  "adresse": "123 Avenue de la République, Kinshasa",
  "date_debut": "2026-01-15",
  "date_fin_prevue": "2026-12-31",
  "statut": "planifié",
  "budget": 150000.00,
  "chef_id": "{{chef_id}}",
  "priorite": "haute"
}
```

**Tests:**
```javascript
pm.test("Chantier created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("chantier_id", jsonData.chantier.id);
});
```

---

### Test 9: Lister les Chantiers
**Méthode:** `GET`  
**URL:** `{{base_url}}/chantiers?statut=planifié&page=1`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Chantiers list retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.chantiers).to.be.an('array');
});
```

---

### Test 10: Obtenir un Chantier
**Méthode:** `GET`  
**URL:** `{{base_url}}/chantiers/{{chantier_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Chantier details retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.chantier.nom).to.be.a('string');
});
```

---

### Test 11: Mettre à Jour un Chantier
**Méthode:** `PUT`  
**URL:** `{{base_url}}/chantiers/{{chantier_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "statut": "en_cours",
  "date_debut": "2026-01-10"
}
```

**Tests:**
```javascript
pm.test("Chantier updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.chantier.statut).to.eql("en_cours");
});
```

---

## 👷 Tests de Gestion des Affectations

### Test 12: Affecter un Ouvrier
**Méthode:** `POST`  
**URL:** `{{base_url}}/affectations`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "chantier_id": "{{chantier_id}}",
  "ouvrier_id": "{{ouvrier1_id}}",
  "date_debut": "2026-01-15",
  "role_sur_chantier": "Maçon",
  "heures_prevues": 160
}
```

**Tests:**
```javascript
pm.test("Affectation created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("affectation_id", jsonData.affectation.id);
});
```

---

### Test 13: Lister les Affectations
**Méthode:** `GET`  
**URL:** `{{base_url}}/affectations?chantier_id={{chantier_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Affectations list retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.affectations).to.be.an('array');
});
```

---

## 📊 Tests de Logs

### Test 14: Lister les Logs
**Méthode:** `GET`  
**URL:** `{{base_url}}/logs?page=1&limit=20`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Tests:**
```javascript
pm.test("Logs retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.logs).to.be.an('array');
});
```

---

## 🔄 Tests Complets (Collection Runner)

### Ordre d'Exécution
1. ✅ Health Check
2. ✅ Register Admin
3. ✅ Login
4. ✅ Get Profile
5. ✅ Create Chef
6. ✅ Create Ouvrier
7. ✅ List Users
8. ✅ Create Chantier
9. ✅ List Chantiers
10. ✅ Get Chantier
11. ✅ Update Chantier
12. ✅ Create Affectation
13. ✅ List Affectations
14. ✅ Get Logs

### Exécuter la Collection
1. Cliquer sur **Collection → Run**
2. Sélectionner l'environnement: **Gestion Chantiers - Production**
3. Cliquer sur **Run Gestion Chantiers Kenia**
4. Vérifier que tous les tests passent ✅

---

## 🛠️ Environnement Local

Pour tester en local, créez un deuxième environnement:

**Nom:** `Gestion Chantiers - Local`

**Variables:**
| Variable | Valeur |
|----------|--------|
| `base_url` | `http://localhost:5000/api` |
| `token` | - |

---

## 📝 Notes Importantes

- ⚠️ **Le premier utilisateur créé doit être un admin**
- 🔐 **Tous les endpoints sauf `/health`, `/auth/register`, `/auth/login` nécessitent un token**
- 📧 **Les emails doivent être uniques**
- 🔑 **Les mots de passe doivent contenir au moins 8 caractères**
