import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInputType, UpdateUserInputType, PublicUserType } from './user.graphql';
import { GetOneInputType } from '../../common/graphql-inputs/common-inputs';
import { catchAsync } from '../../common/lib/catch-async';
import { SendResponse } from '../../common/lib/send-response';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { Auth } from '../../common/decorators/auth.decorator';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Resolver(() => PublicUserType)
export class UserResolver {


  constructor(
    @Inject('PUB_SUB') private readonly  $pubSub: PubSub,
    private readonly usersService: UserService,
  ) {
  }

  @Query(() => [PublicUserType])
  async users() {
    return SendResponse(this.usersService.getMany());
  }

  @Query(() => PublicUserType)
  async user(@Args('data') data: GetOneInputType) {
    return SendResponse(this.usersService.get(data));
  }

  @Auth({ roles: ['admin'] })
  @Mutation(() => PublicUserType)
  async createUser(@Args('data') data: CreateUserInputType) {
    const user = await SendResponse(this.usersService.create(data));
    await this.$pubSub.publish('on-user-created', user);
    return user;
  }

  @Auth({ roles: ['admin'] })
  @Mutation(() => PublicUserType)
  async updateUser(@Args('data') data: UpdateUserInputType) {
    return SendResponse(this.usersService.update(data));
  }

  @Auth({ roles: ['admin'] })
  @Mutation(() => String)
  async deleteUser(@Args('id', ParseMongoIdPipe) id: string) {
    await catchAsync(this.usersService.delete(id));
    return 'OK';
  }

  @Auth({ roles: ['admin'] })
  @Subscription(() => PublicUserType, {
    resolve: payload => payload,
  })
  async userCreated(@Args('token') token: string) {
    return this.$pubSub.asyncIterator<PublicUserType>('on-user-created');
  }
}
