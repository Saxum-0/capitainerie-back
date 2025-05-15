const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const Catways = require('../models/catway');
const expect = chai.expect;

chai.use(chaiHttp);

let token;
let createdCatwayId;

 after(async () => {
    await Catways.deleteOne({ catwayNumber: 777 });
  });

describe('Catways API', () => {
  before(async () => {
    // Créer un utilisateur
    await chai.request(app).post('/users').send({
      name: 'Testeur',
      email: 'test@api.fr',
      password: '123456'
    });

    // Se connecter
    const res = await chai.request(app).post('/login').send({
      email: 'test@api.fr',
      password: '123456'
    });

    token = res.body.token;
  });

  it('GET /catways → devrait retourner un tableau', async () => {
    const res = await chai.request(app).get('/catways')
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /catways → devrait créer un catway', async () => {
    const res = await chai.request(app).post('/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 999, type: 'long', catwayState: 'en test' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
    createdCatwayId = res.body._id;
  });

  it('GET /catways/:id → devrait retourner le catway créé', async () => {
    const res = await chai.request(app).get(`/catways/${createdCatwayId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
  });

  it('PATCH /catways/:id → devrait mettre à jour le catway', async () => {
    const res = await chai.request(app).patch(`/catways/${createdCatwayId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayState: 'modifié' });
    expect(res).to.have.status(200);
  });

  it('DELETE /catways/:id → devrait supprimer le catway', async () => {
    const res = await chai.request(app).delete(`/catways/${createdCatwayId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
  });
});
