import { Module } from '@nestjs/common';
import { PostCommentResolver } from './post-comment.resolver';
import { PostCommentService } from './post-comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import PostCommentSchema from './post-comment.schema';
import UserSchema from '../user/user.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PostComment', schema: PostCommentSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [PostCommentResolver, PostCommentService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
})
export class PostCommentModule {
}
