import mongoose, { model } from 'mongoose';
import { Schema } from 'mongoose';
const photoSchema = new Schema({
    filename: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isPublic: { type: mongoose.Schema.Types.Boolean, default: false },
});
photoSchema.static('findPaginated', function (filter, options) {
    const defaults = { skip: 0, limit: 10 };
    const opts = Object.assign({}, defaults, options);
    const countQuery = this.find(filter);
    let findQuery = this.find(filter);
    if (opts.sort) {
        findQuery = findQuery.sort(opts.sort);
    }
    if (opts.fields) {
        findQuery = findQuery.select(options.fields);
    }
    findQuery = findQuery.limit(options.limit).skip(options.skip);
    return Promise.all([countQuery, findQuery]);
});
export default model('Photo', photoSchema);
//# sourceMappingURL=photo.model.js.map