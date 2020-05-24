import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './post.interface';
import { CreatePostInputType, UpdatePostInputType } from './post.graphql';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly $postModel: Model<IPost>,
    private readonly $currentUser: CurrentUser,
  ) {
  }

  getMany() {
    return this.$postModel.find().exec();
  }

  get(id: string) {
    return this.$postModel.findById(id).exec();
  }

  create(data: CreatePostInputType) {
    return this.$postModel.create({
      ownerId: this.$currentUser.user._id,
      title: data.title,
      content: data.content,
    });
  }

  update(id: string, data: UpdatePostInputType) {
    return this.$postModel.findByIdAndUpdate(id, {
      title: data.title ? data.title : undefined,
      content: data.content ? data.content : undefined,
    }, { new: true });
  }

  delete(id: string) {
    return this.$postModel.findByIdAndDelete(id);
  }
}
