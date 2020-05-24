import { HttpException } from '@nestjs/common';

export const catchAsync = <T>(promise: Promise<T>) => promise.catch(err => {
  throw new HttpException(err, 400);
});