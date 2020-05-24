import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CreatePostInputType, PostCreatedType, PostType, UpdatePostInputType } from './post.graphql';
import { PostService } from './post.service';
import { SendResponse } from '../../common/lib/send-response';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '@app/current-user';

@Resolver(() => PostType)
export class PostResolver {
  constructor(
    @Inject('PUB_SUB') private readonly $pubSub: PubSub,
    private readonly $postService: PostService,
    private readonly $currentUser: CurrentUser,
  ) {
  }

  @Query(() => [PostType])
  posts() {
    return SendResponse(this.$postService.getMany());
  }

  @Query(() => PostType)
  post(@Args('id', ParseMongoIdPipe) id: string) {
    return SendResponse(this.$postService.get(id));
  }

  @UseGuards(AuthRequiredGuard)
  @Mutation(() => PostType)
  async createPost(@Args('data') data: CreatePostInputType) {
    const post = await SendResponse(this.$postService.create(data));

    await this.$pubSub.publish('on-post-created', { user: this.$currentUser.user, post });

    return post;
  }

  @Subscription(() => PostCreatedType, { resolve: payload => payload })
  postCreated() {
    return this.$pubSub.asyncIterator('on-post-created');
  }

  @Mutation(() => PostType)
  updatePost(
    @Args('id', ParseMongoIdPipe) id: string,
    @Args('data') data: UpdatePostInputType,
  ) {
    return SendResponse(this.$postService.update(id, data));
  }

  @Mutation(() => String)
  async deletePost(@Args('id', ParseMongoIdPipe) id: string) {
    await SendResponse(this.$postService.delete(id));
    return 'OK';
  }
}
