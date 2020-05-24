import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthRequiredGuard } from '../../guards/auth-required.guard';
import { RestrictToGuard } from '../../guards/restrict-to.guard';
import { IsOwnerGuard } from '../../guards/is-owner.guard';

type AuthOptions = {
  isOwner?: string,
  roles?: ('admin' | 'user')[]
}

export const Auth = (options?: AuthOptions) => {

  const decorators = [];

  const guards: CanActivate[] | Function[] = [AuthRequiredGuard];

  if (options?.roles?.length > 0) {
    decorators.push(SetMetadata('roles', options.roles));

    guards.push(RestrictToGuard);
  }

  if (options?.isOwner) {
    decorators.push(SetMetadata('model', options.isOwner));

    guards.push(IsOwnerGuard);
  }

  decorators.push(UseGuards(...guards));


  return applyDecorators(...decorators);
};