const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

describe('Tests d\'authentification', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test('POST /api/auth/login - Connexion réussie', async () => {
    // Créer un utilisateur de test
    await db.User.create({
      nom: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  test('POST /api/auth/login - Identifiants invalides', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});