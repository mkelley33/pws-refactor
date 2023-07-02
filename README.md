# WIP

This site/app is a work in progress.

# Getting Started

I should note that most of these instructions were
carried out on MacOS, so some things might require
a little more research for other platforms.

## .env

You'll need to create a `.env.development` file at a minimum to integrate the
client with the server. In it you should type
`GATSBY_API_URL=http://localhost:8080` or whereever you're running the server.

## MongoDB setup

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

1. brew tap mongodb/brew
1. brew update
1. brew install mongodb-community@6.0
1. brew services start mongodb-community@6.0

### Setting up MongoDB

To set up MongoDB do the following:

#### 1. Start MongoDB without access control (/data/db or where your db is).

`mongod --dbpath $(brew --prefix)/var/mongodb`
Connect to the instance.

`mongosh`
Create the user.

`use api-development`

```javascript
db.createUser({
  user: 'admin',
  pwd: 'replace-with-your-password',
  roles: [{ role: 'readWrite', db: 'api-development' }],
});
```

Stop the MongoDB instance and start it again with access control.

`mongod --auth --dbpath $(brew --prefix)/var/mongodb`

Connect and authenticate as the user.

`use 'api-development'`
`db.auth("admin", "replace-with-your-passowrd")`

It should output `{ ok: 1 }` if you have authenticated.

The uri passed to mongoose connect should be the following for local development\:

`mongodb://127.0.0.1:27017/api-development`

#### 2. Set env variables

##### Server

Don't escape any special characters in your password.
Copy the .env.development.sample file to a new .env.development file you must create in the server directory.

## Setting up mailcatcher

This will allow you to visualize and intercept e-mail
in the browser when your `NODE_ENV` is 'test'.

1. `brew install mailcatcher`

2. `brew services start mailcatcher`

3. Open in your browser `http://127.0.0.1:1080/`

4. `npm run test` (A user gets created and sent an e-mail) **Note**: the verification token is sent in
   this e-mail.
5. Return to your brower and refresh. You should see formatted mail messages.

## RECAPTCHA

You'll also need to assign `RECAPTCHA_SITE_KEY` for the reCAPTCHA functionality.
Additionally, create the server `.env.development` in the server directory, and set
`RECAPTCHA_SECRET_KEY` You can obtain values for these keys respectively by going
to https://www.google.com/recaptcha/admin.

1. `cd` into `client` and run `npm install`
1. Then, run `gatsby develop`
1. From the root directory `cd` into `server` and run `npm install`
1. Then, run `npm run dev`. NOTE: you will need to have a MongoDB instance installed and configured in the file `./config/env/development`.

This should be enough to get you up and running. If you have any questions, please feel free to email me at michauxkelley@gmail.com.

## Inspiration and code attributions

This project was initially based on what I learned from the following repo:

https://github.com/kunalkapadia/express-mongoose-es6-rest-api

https://chiragrupani.medium.com/writing-unit-tests-in-typescript-d4719b8a0a40

https://www.testim.io/blog/mocha-for-typescript-testing/
