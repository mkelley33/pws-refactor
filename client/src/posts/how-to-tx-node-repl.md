---
title: 'How to use the tsx REPL to explore your ES2022 models'
date: '2023-07-07'
---

Open a new shell, and install the following dependencies\:

```shell
$ npm i -D tsx dotenv @esbuild-kit/esm-loader`
$ npm i -S mongoose
```

## Configure tsconfig.json

Set the following in your **tsconfig.json**\:

```javascript
{
  "compilerOptions": {
    /* Docs: [https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig) */
    "allowUnreachableCode": true,
    "allowJs": true,
    "baseUrl": ".",
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "NodeNext",
    "noImplicitAny": true,
    "outDir": "dist",
    "paths": {
      "*": ["node_modules/*", "*"]
    },
    "rootDir": ".",
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "strictNullChecks": true,
    "target": "ES2022",
    "typeRoots": ["./node_modules/@types"],
    "types": ["node", "mocha"],
    "useUnknownInCatchVariables": false // TypeScript 4.4+ only!
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "<node_internals>/**", "./dist/**/*"]
}
```

## tsx REPL

Now, you're ready to start the tsx REPL. Open a shell and type the following\:

```shell
$ npx tsx --loader @esbuild-kit/esm-loader
```

And now you should see a `>` indicating that you are in the tsx REPL.

## Use dotenv to load up a configuration file into a variable

Continuing in the REPL\:

Let's say some of your configuration lives in a file in the root level directory named `.env.development`.
This will hold environmental variables that are used in a configuration:

```shell
PWS_USER=admin
PWS_PASS=replace-with-your-password
AUTH_SOURCE=api-development
RECAPTCHA_SECRET_KEY=see-the-readme
EMAIL_PASS=your-email-password
JWT_SECRET=your-jwt-secret
```

I've created a script that will set up a mongoose
connection. It also puts all of your environment
variables on `process.env`. Save the following in
a file named `config.ts` in a directory named `scripts`
under your root directory.

```javascript
import dotenv from 'dotenv';
import mongoose from 'mongoose';
Promise = require('bluebird');
import User from '../app/models/user.model.js';

const config = dotenv.config({ path: './.env.development' });
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api-test', {
  socketTimeoutMS: 0,
  authSource: process.env.AUTH_SOURCE,
  user: process.env.PWS_USER,
  pass: process.env.PWS_PASS,
});

export default config;
export { User };
```

Then open a tsx REPL to use it\:

```javascript
> const config = require('../server/scripts/config.ts');
> const newUser = new config.User({ firstName: 'Michaux', lastName: 'Kelley' });
> await newUser.save();
> const user = await config.User.find({ firstName: 'Michaux' });
```

### Now for some real fun with mongoose models\:

Type `config.User` followed by a dot ., and then press `tab` to see what's available to you. Like so\:

```shell
config.User.find
config.User.findById
config.User.findByIdAndDelete
config.User.findByIdAndRemove
config.User.findByIdAndUpdate
config.User.findOne
...
```

And that's all there is to importing some configuration, connecting to mongoose, and exploring your models with the tsx REPL.

## For further reading\:

https://github.com/esbuild-kit/tsx
