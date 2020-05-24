import { Injectable } from '@nestjs/common';
import { IUser } from '../../../src/modules/user/user.interface';

@Injectable()
export class CurrentUser {
  private _user: IUser;

  get user() {
    return this._user;
  }

  set user(val: IUser) {
    this._user = val;
  }
}
