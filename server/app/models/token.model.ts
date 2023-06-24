import mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface IToken {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

export default mongoose.model('Token', tokenSchema);
