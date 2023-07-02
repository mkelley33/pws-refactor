import mongoose, { HydratedDocument, Document, Model, model } from 'mongoose';
import { Schema } from 'mongoose';

export interface IPhotoDocument extends Document {
  filename: string;
  userId: mongoose.Schema.Types.ObjectId;
  isPublic: mongoose.Schema.Types.Boolean;
}

interface IPhotoModel extends Model<IPhotoDocument> {
  findPaginated: (filter: object, options: object) => Promise<HydratedDocument<IPhotoDocument>[]>;
}

const photoSchema = new Schema<IPhotoDocument, IPhotoModel>({
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

export default model<IPhotoDocument, IPhotoModel>('Photo', photoSchema);
