import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema from './user.schema';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

  ],
  providers: [UserService, UserResolver, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
})
export class UserModule {
}
