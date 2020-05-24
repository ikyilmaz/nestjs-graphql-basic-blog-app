import { CanActivate, ExecutionContext, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUser } from '@app/current-user';
import chalk from 'chalk';

@Injectable()
export class RestrictToGuard implements CanActivate, OnModuleInit {
  private logger: Logger;

  constructor(private readonly $reflector: Reflector, private readonly $currentUser: CurrentUser) {

  }

  onModuleInit() {
    this.logger = new Logger('RestrictToGuard');
  }

  canActivate(context: ExecutionContext) {
    const roles = this.$reflector.get<string[]>('roles', context.getHandler());

    const userRole = this.$currentUser.user.role;

    this.logger.log(chalk.hex(process.env.GUARDS_LOG_COLOR)
    (`--> Permissions: ${roles} | User's Role: ${userRole}`));

    return roles.includes(userRole);
  }
}
