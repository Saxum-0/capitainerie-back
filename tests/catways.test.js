const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('Catways API', () => {
  it('GET /catways → devrait retourner un tableau', (done) => {
    chai
      .request(app)
      .get('/catways')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
