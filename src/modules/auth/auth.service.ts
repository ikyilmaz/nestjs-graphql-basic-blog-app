import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../user/user.interface';
import { SignInInputType } from './auth.graphql';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private readonly $userModel: Model<IUser>,
    private readonly $currentUser: CurrentUser
  ) {}

  getCurrentUser = () => this.$currentUser.user

  create(data: SignInInputType) {
    return this.$userModel.create({ username: data.username, password: data.password });
  }

  get(username: string) {
    return this.$userModel.findOne({ username: username }).exec()
  }
}
