import { IBaseModel } from '../../common/interfaces/base-model.interface';

export interface IPost extends IBaseModel  {
  title: string;
  content: string;
  ownerId: string;
}