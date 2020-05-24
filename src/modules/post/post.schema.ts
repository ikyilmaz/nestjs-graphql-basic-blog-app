import { Schema, SchemaTypes } from 'mongoose';

const PostSchema = new Schema({
  ownerId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'field \'ownerId\' can not be null'],
  },
  title: {
    type: SchemaTypes.String,
    required: [true, 'field \'title\' can not be empty'],
    min: 2,
    max: 126,
    trim: true,
  },
  content: {
    type: SchemaTypes.String,
    min: 2,
    max: 10000,
    required: [true, 'field \'content\' can not be empty'],
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

export default PostSchema;