import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const tokenSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});
export default mongoose.model('Token', tokenSchema);
//# sourceMappingURL=token.model.js.map