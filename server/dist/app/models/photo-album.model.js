import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const PhotoAlbumSchema = new Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    photos: { type: (Array) },
    isPublic: { type: Boolean, required: true },
}, { timestamps: true });
export default mongoose.model('PhotoAlbum', PhotoAlbumSchema);
//# sourceMappingURL=photo-album.model.js.map