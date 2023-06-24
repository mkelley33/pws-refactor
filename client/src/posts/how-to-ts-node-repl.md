# How to use the ts-node REPL in 2023 with Mongoose models and more

Open a new shell, and install the following dependencies\:

- `npm i -D ts-node dotenv`
- `npm i -S mongoose`

## Configure tsconfig.json

Set the following in your **tsconfig.json**\:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "es2022",
    "moduleResolution": "node"
  }
}
```

Below `compilerOptions` add ts-node options\:

```json
"ts-node": {
  "esm": true,
  "compilerOptions": {
    "module": "nodenext",
  }
},
```

## ts-node REPL

Now, you're ready to start the ts-node REPL. Open a shell and type the following\:

`npx ts-node`

And now you should see a `>` indicating that you are in the ts-node REPL.

## Use dotenv to load up a configuration file into a variable

Continuing in the REPL\:

Let's say some of your configuration lives in a file in the root level directory named `.env.development`.
This will hold environmental variables that are used in a configuration:

```sh
PWS_USER=admin
PWS_PASS=replace-with-your-password
AUTH_SOURCE=api-development
RECAPTCHA_SECRET_KEY=see-the-readme
EMAIL_PASS=your-email-password
JWT_SECRET=your-jwt-secret
```

Next create the configuration module\:

The tree should look like this\:

server/config
├── env
│ ├── development.js
│ ├── index.ts
│ ├── production.js
│ └── test.js

```javascript
export default {
  env: 'development',
  protocol: 'http',
  host: 'localhost',
  clientPort: ':8000',
  mail: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
    sender: 'John Doe <jdoe@gmail.com>',
  },
  MONGOOSE_DEBUG: true,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://127.0.0.1:27017/your-db-name',
    configureOptions() {
      return {
        useNewUrlParser: true,
        socketTimeoutMS: 0,
        useUnifiedTopology: true,
        authSource: process.env.AUTH_SOURCE,
        user: process.env.PWS_USER,
        pass: process.env.PWS_PASS,
      };
    },
  },
  port: 8080,
};
```

1. `import dotenv from 'dotenv';`
2. `dotenv.config({ path: './.env.development' });` **Note**: you'll need to create a `.env.development` file
3. `import cfg from './config/env';` I'll write out the `./config/env` module below
4. `const config = await cfg;`
5. `Promise = require('bluebird');`
6. `import mongoose from 'mongoose';`
7. `mongoose.Promise = Promise;`
8. `const dbOptions = config.default.db.configureOptions();`
9. `mongoose.connect(config.default.db.uri, dbOptions);`
10. `import User from './app/models/user.model';`
11. `const user = new User({ firstName: 'Robert', lastName: 'Smith' });`

### Now for some real fun with mongoose models\:

Type `User` followed by a dot ., and then press `tab` to see what's available to you. Like so\:

```sh
User.find
User.findById
User.findByIdAndDelete
User.findByIdAndRemove
User.findByIdAndUpdate
User.findOne
...
```

### Now create a user\:

1. `const robert = await new User({ firstName: 'Robert', lastName: 'Smith' });`
1. `robert.save()` This will run your validation so make sure you provide a good value for every field when creating a new instance of your model.
1. `const robertsFound = await User.find({ firstName: 'Robert' });`

And that's all there is to importing some configuration, connecting to mongoose, and exploring your models with ts-node.
