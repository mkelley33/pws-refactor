import dotenv from 'dotenv';
import config from '../config/env/index.js';
import mongoose from 'mongoose';
before((done) => {
    dotenv.config({ path: './.env/test' });
    done();
});
beforeEach(function (done) {
    mongoose.connect(config.default.db.uri, config.default.db.options);
    const finish = (err) => {
        mongoose.connection.removeListener('open', finish);
        mongoose.connection.removeListener('error', finish);
    };
    mongoose.connection.on('error', finish);
    mongoose.connection.on('open', async function () {
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(async (collectionInfo) => {
            await mongoose.connection.db.dropCollection(collectionInfo.name);
        });
        finish();
    });
    done();
});
afterEach(function (done) {
    done();
});
//# sourceMappingURL=setup.js.map