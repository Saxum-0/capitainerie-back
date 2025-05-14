const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('Reservations API', () => {
  let token;
  let catwayId;
  let reservationId;

  before(async () => {
    // Créer un utilisateur
    await chai.request(app).post('/users').send({
      name: 'Test Reservation',
      email: 'test.reservation@example.com',
      password: 'password123'
    });

    // Connexion
    const loginRes = await chai.request(app).post('/login').send({
      email: 'test.reservation@example.com',
      password: 'password123'
    });

    token = loginRes.body.token;

    // Créer un catway pour l'utiliser dans la réservation
    const catwayRes = await chai.request(app)
      .post('/catways')
      .set('Authorization', `Bearer ${token}`)
      .send({ catwayNumber: 777, type: 'long', catwayState: 'libre' });

    catwayId = catwayRes.body._id;
  });

  it('POST /catways/:id/reservations → créer une réservation', async () => {
    const res = await chai
      .request(app)
      .post(`/catways/${catwayId}/reservations`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        catwayNumber: 777,
        clientName: 'Testeur',
        boatName: 'Bateau Fantôme',
        checkIn: '2025-06-21',
        checkOut: '2025-06-25'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
    reservationId = res.body._id;
  });

  it('GET /catways/:id/reservations → devrait retourner les réservations du catway', async () => {
    const res = await chai
      .request(app)
      .get(`/catways/${catwayId}/reservations`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /catways/:catwayId/reservations/:idReservation → devrait retourner une réservation', async () => {
    const res = await chai
      .request(app)
      .get(`/catways/${catwayId}/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.clientName).to.equal('Testeur');
  });

  it('DELETE /catways/:catwayId/reservations/:idReservation → devrait supprimer une réservation', async () => {
    const res = await chai
      .request(app)
      .delete(`/catways/${catwayId}/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.message).to.include('supprimée');
  });
});

