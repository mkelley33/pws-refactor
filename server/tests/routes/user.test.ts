import { use } from 'chai';
import superagent from 'chai-superagent';
import request from 'superagent';
import chai from 'chai';
import User from '../../app/models/user.model.js';
import APIError from '../../app/helpers/APIError.js';

use(superagent());

const expect = chai.expect;

describe('User API Routes', () => {
  describe('# POST /users', () => {
    const user = {
      firstName: 'Pat',
      lastName: 'Schneeweis',
      password: 'cb01MK#3',
      email: 'ptb15@example.test.com',
    };
    it('creates a new user', (done) => {
      request
        .post('http://localhost:8080/api/v1/users')
        .type('json')
        .send(user)
        .end((_err: APIError, res: any) => {
          if (_err) throw _err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.firstName).to.equal(user.firstName);
          expect(res.body.lastName).to.equal(user.lastName);
          expect(res.body.email).to.equal(user.email);
          expect(res.body).to.not.have.property('password');
          User.findByIdAndRemove({ _id: res.body._id }, (err: APIError) => {
            if (err) console.log(err);
          });
          done();
        });
    });
  });
});
