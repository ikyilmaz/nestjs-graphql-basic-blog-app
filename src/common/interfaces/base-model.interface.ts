import * as mongoose from 'mongoose';

export interface IBaseModel extends mongoose.Document {
  _id: string;

  createdAt: Date;
  updatedAt: Date;
}