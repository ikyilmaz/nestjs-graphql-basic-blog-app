import { IBaseModel } from '../../common/interfaces/base-model.interface';

export interface IUser extends IBaseModel {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "admin" | "user";
}