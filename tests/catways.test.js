const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // assure-toi que tu exportes app dans server.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('Catways API', () => {
  it('should return all catways', (done) => {
    chai.request(app)
      .get('/catways')
      .set('Authorization', 'Bearer VOTRE_TOKEN_ICI') // Remplace ou mocke
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
