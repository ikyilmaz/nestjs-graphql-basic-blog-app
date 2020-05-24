import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  PrivateUserType,
  SignInInputType,
  SignInType,
  SignUpInputType,
  SignUpType,
} from './auth.graphql';
import { AuthService } from './auth.service';
import { catchAsync } from '../../common/lib/catch-async';
import { IUser } from '../user/user.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Auth } from '../../common/decorators/auth.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly $authService: AuthService,
  ) {
  }

  @Auth()
  @Query(() => PrivateUserType)
  async me() {
    return this.$authService.getCurrentUser();
  }

  @Mutation(() => SignUpType)
  async signUp(@Args('data') data: SignUpInputType) {
    return this.createToken(await catchAsync(this.$authService.create(data)));
  }

  @Mutation(() => SignInType)
  async signIn(@Args('data') data: SignInInputType) {
    const user = await catchAsync(this.$authService.get(data.username));

    if (!user) throw new UnauthorizedException('username or password is not correct');

    if (!(await bcrypt.compare(data.password, user.password))) throw new UnauthorizedException('username or password is not correct');

    return this.createToken(user);

  }

  private createToken = async (user: IUser) => {
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { token, user };
  };
}
