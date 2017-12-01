const expect = require('expect');
const request = require('supertest');

const { app } = require('../../index');

describe('Guild Management Server', () => {

  describe('POST /guild/users', () => {

    it('should create a new user', (done) => {

      request(app)
        .post('/guild/users')
        .send({
          nome: 'Gandalf',
          idpsn: 'GandalfTheGray',
          dataNasc: '0000-00-00',
          dataClan: '2017-11-10',
          cidade: 'Somewhere in middle earth',
          jogos: 'Shadow of War,LOTR Online',
          email: 'gandalf@epicsax.com',
          password: 'mellon',
        })
        .expect(200)
        .end(done);

    });

  });

});
