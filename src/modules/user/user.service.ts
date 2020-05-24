import { Injectable } from '@nestjs/common';
import { CreateUserInputType, UpdateUserInputType } from './user.graphql';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './user.interface';
import { Model } from 'mongoose';
import { GetOneInputType } from '../../common/graphql-inputs/common-inputs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
  ) {
  }

  getMany() {
    return this.userModel.find().exec();
  }

  get(data: GetOneInputType) {
    return this.userModel.findById(data._id);
  }

  async create({ username, password }: CreateUserInputType) {
    return this.userModel.create({ username, password });
  }

  async update(data: UpdateUserInputType) {
    const user = await this.userModel.findByIdAndUpdate(data._id, { username: data.username ? data.username : undefined }, { new: true });
    console.log(user);
    return user;
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
