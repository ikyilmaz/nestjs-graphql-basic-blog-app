import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import PostSchema from './post.schema';
import UserSchema from '../user/user.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }, { name: 'User', schema: UserSchema }]),
  ],
  providers: [PostResolver, PostService, {
    provide: "PUB_SUB",
    useValue: new PubSub()
  }],
})
export class PostModule {
}
