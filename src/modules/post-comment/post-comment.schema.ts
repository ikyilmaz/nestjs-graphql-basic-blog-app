import { Schema, SchemaTypes } from 'mongoose';
import { IPostComment } from './post-comment.interface';

const PostCommentSchema = new Schema<IPostComment>({
  ownerId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'field \'ownerId\' can not be null'],
  },
  postId: {
    type: SchemaTypes.ObjectId,
    ref: 'Post',
    required: [true, 'field \'postId\' can not be null'],
  },
  content: {
    type: SchemaTypes.String,
    min: 2,
    max: 256,
    required: [true, 'field \'content\'can not be null'],
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

PostCommentSchema.virtual('post', {
  ref: 'Post',
  foreignField: '_id',
  localField: 'postId',
  justOne: true,
});

export default PostCommentSchema;