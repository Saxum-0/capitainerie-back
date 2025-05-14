const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

let token;

describe('Catways API', () => {
  // Se connecter avant tous les tests
  before((done) => {
    chai
      .request(app)
      .post('/login')
      .send({ email: 'admin@example.com', password: 'admin123' }) // 👈 adapte ça selon ton compte
      .end((err, res) => {
        expect(res).to.have.status(200);
        token = res.body.token;
        done();
      });
  });

  it('GET /catways → devrait retourner un tableau', (done) => {
    chai
      .request(app)
      .get('/catways')
      .set('Authorization', `Bearer ${token}`) // 👈 ajoute le token ici
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
