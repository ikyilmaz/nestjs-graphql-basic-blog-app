import { CanActivate,  ExecutionContext, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {  Request } from 'express';
import { CurrentUser } from '@app/current-user';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import chalk from 'chalk';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../modules/user/user.interface';
import { catchAsync } from '../common/lib/catch-async';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthRequiredGuard implements CanActivate, OnModuleInit {
  logger: Logger;

  constructor(
    private $currentUserService: CurrentUser,
    @InjectModel('User') private $userModel: Model<IUser>,
  ) {
  }

  onModuleInit() {
    this.logger = new Logger('AuthRequiredGuard');
  }

  async canActivate(context: ExecutionContext) {
    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)('--> AuthRequired START'));

    const req = GqlExecutionContext.create(context).getContext<any>().req as Request;
    const gqlArgs = GqlExecutionContext.create(context).getArgs();

    const isAuthHeaderAndIsStatsWithBearer = req?.headers?.authorization?.startsWith('Bearer ');
    const cookiesHaveJwt = req?.cookies?.jwt;

    let token: string;

    if (isAuthHeaderAndIsStatsWithBearer) token = req?.headers?.authorization?.split(' ')[1];
    else if (cookiesHaveJwt) token = req?.cookies?.jwt;
    else if (gqlArgs.token) token = gqlArgs.token;

    if (!token) return false;

    //@ts-ignore
    const decoded = await catchAsync(promisify(jwt.verify)(token, process.env.JWT_SECRET) as Promise<{ id: string; iat: string }>);

    if (!decoded.id) return false;

    const user = await this.$userModel.findById(decoded.id);

    if (!user) return false;

    this.$currentUserService.user = user;

    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)('--> AuthRequired END'));

    return true;
  }
}