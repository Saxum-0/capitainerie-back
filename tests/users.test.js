const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/user'); // <- pour le nettoyage
const { expect } = chai;

chai.use(chaiHttp);

describe('Users API', () => {
  let userId;
  let token;

  // Email unique pour éviter les conflits en base
  const testEmail = `testuser_${Date.now()}@example.com`;

  const testUser = {
    name: 'Test User',
    email: testEmail,
    password: 'password123'
  };

  // Nettoyer avant le test (par sécurité)
  before(async () => {
    await User.deleteOne({ email: testEmail });
  });

  it('POST /users → devrait créer un utilisateur', (done) => {
    chai.request(app)
      .post('/users')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('POST /login → devrait se connecter et retourner un token', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: testUser.email, password: testUser.password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        userId = res.body.user.id;
        done();
      });
  });

  it('PUT /users/:id → devrait modifier un utilisateur', (done) => {
    chai.request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.include('modifié');
        done();
      });
  });

  it('DELETE /users/:id → devrait supprimer un utilisateur', (done) => {
    chai.request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.include('supprimé');
        done();
      });
  });
});

