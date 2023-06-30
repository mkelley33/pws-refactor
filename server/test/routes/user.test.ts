import User from '../../app/models/user.model';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../..';

chai.use(chaiHttp);

describe('User API Routes', () => {
  describe('# POST /users', () => {
    const user = {
      firstName: 'Pat',
      lastName: 'Schneeweis',
      password: 'cb01MK#3',
      email: 'ptb15@example.test.com',
    };
    it('creates a new user', (done) => {
      chai
        .request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.email).to.equal(user.email);
          expect(res.body).to.not.have.property('password');
          User.findByIdAndRemove({ _id: res.body._id }, (err, data) => {
            if (err) {
              console.log(err);
            }
          });
          done();
        });
    });
  });
});
