import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPostComment } from './post-comment.interface';
import { CreatePostCommentInput, UpdatePostCommentInput } from './post-comment.graphql';
import { CurrentUser } from '@app/current-user';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectModel('PostComment') private readonly $postCommentModel: Model<IPostComment>,
    private readonly $currentUser: CurrentUser
  ) {
  }

  getMany() {
    return this.$postCommentModel.find();
  }

  get(id: string) {
    return this.$postCommentModel.findById(id);
  }

  create(data: CreatePostCommentInput) {
    return this.$postCommentModel.create({
      ownerId: this.$currentUser.user.id,
      postId: data.postId,
      content: data.content
    })
  }

  update(id: string, data: UpdatePostCommentInput) {
    return this.$postCommentModel.findByIdAndUpdate(id, { content: data.content }, { new: true });
  }

  delete(id: string) {
    return this.$postCommentModel.findByIdAndDelete(id).exec();
  }
}
