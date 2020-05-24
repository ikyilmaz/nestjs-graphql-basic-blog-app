import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUser } from '@app/current-user';
import { Connection, Document } from 'mongoose';
import { GqlExecutionContext } from '@nestjs/graphql';
import chalk from 'chalk';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class IsOwnerGuard implements CanActivate, OnModuleInit {
  private logger: Logger;

  constructor(
    @InjectConnection() private readonly $connection: Connection,
    private readonly $reflector: Reflector,
    private readonly $currentUser: CurrentUser,
  ) {
  }

  onModuleInit() {
    this.logger = new Logger('IsOwnerGuard');
  }

  async canActivate(context: ExecutionContext) {

    const modelName = this.$reflector.get<string>('model', context.getHandler());

    const id = GqlExecutionContext.create(context).getArgs().id;

    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)
    (`--> Given Model: ${modelName} Model's ID: ${id}`));

    const doc = await this.$connection.model(modelName).findOne({ _id: id }) as Document & { ownerId: string };

    if (!doc) throw new NotFoundException();

    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)
    (`--> User's ID: ${this.$currentUser.user.id} Owner's ID: ${doc.ownerId}`));

    const isOwner = this.$currentUser.user.id == doc.ownerId;
    const isAdmin = this.$currentUser.user.role == 'admin';

    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)
    (`--> isOwner: ${isOwner} || isAdmin: ${isAdmin}`));

    return (isOwner || isAdmin);
  }
}
