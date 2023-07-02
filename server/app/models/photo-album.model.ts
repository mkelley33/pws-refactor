import mongoose from 'mongoose';
import PhotoSchema from './photo.model.js';

const Schema = mongoose.Schema;

const PhotoAlbumSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    photos: { type: [PhotoSchema] },
    isPublic: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('PhotoAlbum', PhotoAlbumSchema);
