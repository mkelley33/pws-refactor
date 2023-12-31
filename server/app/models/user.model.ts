import mongoose, { Model, Document, Schema, model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { messages, patterns } from '../validation/index.js';
import APIError from '../helpers/APIError.js';
import httpStatus from 'http-status';

const ROLE_ADMIN = 'admin';
const ROLE_FAMILY = 'family';
const ROLE_FRIEND = 'friend';
const ROLE_USER = 'user';
const DEFAULT_MAX_LENGTH = 50;

const normalizePhone = (value: string) => {
  if (value) return value.replace(/[\D]*/, '');
  return value;
};

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isVerified: boolean;
  verifiedAt: Date;
  createdAt: Date;
  roles: IRolesType;
  comparePassword(password: string, cb: (err: Error | null, isMatch?: boolean) => void): void;
}

export interface IRoleType {
  type: string;
  enum: string[];
}

interface IRolesType {
  type: IRoleType[];
  default: string[];
}

interface IUserModel extends Model<IUserDocument> {
  list: (limit: number, skip: number) => Promise<HydratedDocument<IUserDocument>[]>;
  get: (id: mongoose.Types.ObjectId) => Promise<HydratedDocument<IUserDocument, {}, {}>>;
  getByEmail: (email: string) => Promise<HydratedDocument<IUserDocument, {}, {}>>;
}

const userSchema = new Schema<IUserDocument, IUserModel>({
  firstName: {
    type: String,
    trim: true,
    required: [true, messages.blank],
    maxlength: [DEFAULT_MAX_LENGTH, messages.maxlength(DEFAULT_MAX_LENGTH)],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, messages.blank],
    // TODO: Figure out a way to validate and return message for maxLength
    maxlength: [DEFAULT_MAX_LENGTH, messages.maxlength(DEFAULT_MAX_LENGTH)],
  },
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    match: [patterns.email, messages.email],
    required: [true, messages.blank],
    unique: true,
  },
  password: {
    type: String,
    required: [true, messages.blank],
    // bcrypt doesn't allow passwords longer than 72 bytes or 18 utf-8 characters
    maxlength: 18,
    // TODO: Verify and ensure that no more than 2 identical characters in a row are used in a password.
    // https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Password_Complexity
    match: [patterns.password, messages.password],
    select: false,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    set: normalizePhone,
    match: [patterns.phone, messages.phone],
    index: true,
  },
  isVerified: {
    type: Boolean,
    default: function () {
      return !!this.verifiedAt;
    },
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  roles: {
    type: [
      {
        type: String,
        enum: [ROLE_ADMIN, ROLE_FAMILY, ROLE_FRIEND, ROLE_USER],
      },
    ],
    default: [ROLE_USER],
  },
});

userSchema.pre('save', function (next: mongoose.CallbackWithoutResultAndOptionalError) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.method(
  'comparePassword',
  function comparePassword(password: string, callback: (error: Error | null, isMatch?: boolean) => void): void {
    bcrypt.compare(password, this.password, (error, data) => {
      if (error) callback(error);
      callback(null, data);
    });
  }
);

userSchema.static('list', function list(skip: number, limit: number) {
  return this.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
});

userSchema.static('get', async function get(id) {
  const user = await this.findById(id).exec();
  if (user) return user;
  const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
  return Promise.reject(err);
});

userSchema.static('getByEmail', function getByEmail(email: string) {
  return this.findOne({ email }).select('+password').exec();
});

userSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.password;
    return ret;
  },
});

export default model<IUserDocument, IUserModel>('User', userSchema);
export { ROLE_ADMIN, ROLE_FRIEND, ROLE_FAMILY, ROLE_USER };
