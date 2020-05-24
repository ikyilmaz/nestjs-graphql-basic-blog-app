import { Schema, SchemaTypes } from 'mongoose';
import { IUser } from './user.interface';
import * as bcrypt from 'bcryptjs';

const UserSchema = new Schema<IUser>({
  firstName: {
    type: SchemaTypes.String,
    required: false,
  },
  lastName: {
    type: SchemaTypes.String,
    required: false,
  },
  username: {
    type: SchemaTypes.String,
    required: [true, 'field \'username\' can not be null'],
    minlength: 2,
    maxlength: 36,
  },
  password: {
    type: SchemaTypes.String,
    required: [true, 'field \'password\' can not be null'],
  },
  role: {
    type: SchemaTypes.String,
    enum: {
      values: ['admin', 'user'],
      message: 'field \'role\' must be in "\'admin\', \'user\'"',
    },
    default: 'user',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// hash the password before save
UserSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password') || this.isNew) this.password = await bcrypt.hash(this.password, 12);
  next();
});


export default UserSchema;

