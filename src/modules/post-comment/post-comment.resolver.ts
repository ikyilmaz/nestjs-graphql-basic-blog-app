import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentInput, PostCommentType, UpdatePostCommentInput } from './post-comment.graphql';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { SendResponse } from '../../common/lib/send-response';
import { catchAsync } from '../../common/lib/catch-async';
import { Auth } from '../../common/decorators/auth.decorator';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { CurrentUser } from '@app/current-user';
import { OnCommentMyPostsType } from '../auth/auth.graphql';
import { ParseJwtPipe } from '../../common/pipes/parse-jwt.pipe';

@Resolver('PostComment')
export class PostCommentResolver {
  constructor(
    @Inject('PUB_SUB') private readonly $pubSub: PubSub,
    private readonly $postCommentService: PostCommentService,
    private readonly $currentUser: CurrentUser,
  ) {
  }

  @Query(() => [PostCommentType])
  postComments() {
    return SendResponse(this.$postCommentService.getMany());
  }

  @Query(() => PostCommentType)
  postComment(@Args('id', ParseMongoIdPipe) id: string) {
    return SendResponse(this.$postCommentService.get(id));
  }

  @Auth()
  @Mutation(() => PostCommentType)
  async createPostComment(@Args('data') data: CreatePostCommentInput) {
    const postComment = await SendResponse(this.$postCommentService.create(data));

    await postComment.populate({
      path: 'post',
    }).execPopulate();

    await this.$pubSub.publish(`on-comment-${(postComment as any).post.ownerId}-posts`, {
      user: this.$currentUser.user,
      post: (postComment as any).post,
    });

    // console.log((postComment as any).post.ownerId);

    return postComment;
  }

  @Auth()
  @Subscription(() => OnCommentMyPostsType, {
    resolve: payload => payload
  })
  async onCommentMyPosts(@Args('token', ParseJwtPipe) token: string) {
    console.log(this.$currentUser.user.id)
    return this.$pubSub.asyncIterator(`on-comment-${this.$currentUser.user.id}-posts`);
  }

  @Auth({ isOwner: 'PostComment' })
  @Mutation(() => PostCommentType)
  updatePostComment(@Args('id', ParseMongoIdPipe) id: string, @Args('data') data: UpdatePostCommentInput) {
    return SendResponse(this.$postCommentService.update(id, data));
  }

  @Auth({ isOwner: 'PostComment' })
  @Mutation(() => String)
  async deletePostComment(@Args('id', ParseMongoIdPipe) id: string) {
    await catchAsync(this.$postCommentService.delete(id));
    return 'OK';
  }

}
