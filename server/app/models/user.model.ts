import mongoose, { Model, Document, Schema, model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import { messages, patterns } from '../validation';

const ROLE_ADMIN = 'admin';
const ROLE_FAMILY = 'family';
const ROLE_FRIEND = 'friend';
const ROLE_USER = 'user';

const normalizePhone = (value: string) => {
  if (value) return value.replace(/[\D]*/, '');
  return value;
};

interface IUserDocument extends Document {
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

interface IRoleType {
  type: string;
  enum: string[];
}

interface IRolesType {
  type: IRoleType[];
  default: string[];
}

interface IUserModel extends Model<IUserDocument> {
  list: (skip: number, limit: number) => Promise<HydratedDocument<IUserDocument>[]>;
}

const userSchema = new Schema<IUserDocument, IUserModel>({
  firstName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    match: [patterns.email, messages.email],
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // TODO: verfiy this statement for bcryptjs: bcrypt limits max password length to 72 characters.
    // For now, 72 will do just fine
    maxlength: 72,
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

// userSchema.statics = {
//   get(id) {
//     return this.findById(id)
//       .exec()
//       .then((user: IUserDocument) => {
//         if (user) return user;
//         const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
//         return Promise.reject(err);
//       });
//   },
//   list({ skip = 0, limit = 50 } = {}) {
//
//   },
//   getByEmail(email) {
//     return this.findOne({ email }).select('+password').exec();
//   },
// };

userSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.password;
    return ret;
  },
});

export default model<IUserDocument, IUserModel>('User', userSchema);
export { ROLE_ADMIN, ROLE_FRIEND, ROLE_FAMILY, ROLE_USER };
