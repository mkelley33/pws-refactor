import axios from 'axios';
import chai from 'chai';
import { ROLE_ADMIN, ROLE_FRIEND, ROLE_FAMILY, ROLE_USER } from '../../app/models/user.model.js';

const expect = chai.expect;

describe('User API Routes', () => {
  describe('# POST /users', function () {
    const user = {
      firstName: 'Pat',
      lastName: 'Schneeweis',
      password: 'cb01MK#3',
      email: 'patthebunny@example.test.com',
    };

    it(`Creates a new default user at ${user.email}`, async function () {
      const res = await axios.post('http://localhost:8080/api/v1/users', user);
      expect(res.status).to.equal(200);
      expect(res.data.firstName).to.equal(user.firstName);
      expect(res.data.lastName).to.equal(user.lastName);
      expect(res.data.email).to.equal(user.email.toLowerCase());
      expect(res.data.isVerified).to.be.false;
      expect(res.data.phone).to.be.undefined;
      expect(res.data.roles).to.contain(ROLE_USER);
      expect(res.data.roles).to.not.contain(ROLE_ADMIN);
      expect(res.data.roles).to.not.contain(ROLE_FAMILY);
      expect(res.data.roles).to.not.contain(ROLE_FRIEND);
      expect(res.data).to.not.have.property('password');
    });

    it('Does not create a new user without required properties', async function () {
      const user = {
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        email: undefined,
      };

      try {
        const uri = 'http://localhost:8080/api/v1/users';
        await axios.post(uri, user);
      } catch (e: any) {
        expect(e.response.status).to.equal(422);
        expect(e.response.statusText).to.equal('Unprocessable Entity');
        expect(e.response.data.errors.firstName.message).to.be.equal("Can't be blank");
        expect(e.response.data.errors.lastName.message).to.be.equal("Can't be blank");
        expect(e.response.data.errors.password.message).to.be.equal("Can't be blank");
        expect(e.response.data.errors.email.message).to.be.equal("Can't be blank");
      }
    });

    it('Does not create a new user without a strong password', async function () {
      const user = {
        firstName: 'Ceschi',
        lastName: 'Ramos',
        password: 'easy',
        email: 'ceschi@test.example.com',
      };

      try {
        const uri = 'http://localhost:8080/api/v1/users';
        await axios.post(uri, user);
      } catch (e: any) {
        expect(e.response.status).to.equal(422);
        expect(e.response.statusText).to.equal('Unprocessable Entity');
        expect(e.response.data.errors.password.message).to.be.equal(
          'Must contain a combination of at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*), and be at least 8 characters long',
        );
      }
    });
    it('Does not create a new user without a valid email', async function () {
      const user = {
        firstName: 'Ceschi',
        lastName: 'Ramos',
        password: 'easy',
        email: 'email',
      };

      try {
        const uri = 'http://localhost:8080/api/v1/users';
        await axios.post(uri, user);
      } catch (e: any) {
        expect(e.response.status).to.equal(422);
        expect(e.response.statusText).to.equal('Unprocessable Entity');
        expect(e.response.data.errors.email.message).to.be.equal('Must be a valid e-mail address');
      }
    });

    it('Does not create a new user with a first name longer than 50 characters', async function () {
      const user = {
        firstName: 'C'.repeat(51),
        lastName: 'Ramos',
        password: 'easy',
        email: 'email@example.test.com',
      };

      try {
        const uri = 'http://localhost:8080/api/v1/users';
        await axios.post(uri, user);
      } catch (e: any) {
        expect(e.response.status).to.equal(422);
        expect(e.response.statusText).to.equal('Unprocessable Entity');
        expect(e.response.data.errors.firstName.message).to.be.equal("Can't be longer than 50 characters");
      }
    });

    it('Does not create a new user with a last name longer than 50 characters', async function () {
      const user = {
        firstName: 'Ceschi',
        lastName: 'R'.repeat(51),
        password: 'Easy123!',
        email: 'email@example.test.com',
      };

      try {
        const uri = 'http://localhost:8080/api/v1/users';
        await axios.post(uri, user);
      } catch (e: any) {
        expect(e.response.status).to.equal(422);
        expect(e.response.statusText).to.equal('Unprocessable Entity');
        expect(e.response.data.errors.lastName.message).to.be.equal("Can't be longer than 50 characters");
      }
    });
  });
});
