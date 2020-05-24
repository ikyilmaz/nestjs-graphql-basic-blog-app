import { catchAsync } from './catch-async';
import { NotFoundException } from '@nestjs/common';

export const SendResponse = async <T>(data: T) => {
  if (data instanceof Promise) data = await catchAsync(data);

  if (!data || (Array.isArray(data) && data.length == 0)) throw new NotFoundException();

  return data;
};