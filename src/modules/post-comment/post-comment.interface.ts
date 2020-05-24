import { IBaseModel } from '../../common/interfaces/base-model.interface';

export interface IPostComment extends IBaseModel {
  postId: string;

  ownerId: string;

  content: string;
}