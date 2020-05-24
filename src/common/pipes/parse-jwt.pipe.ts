import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isJWT } from 'class-validator';

@Injectable()
export class ParseJwtPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (!isJWT(value)) throw new BadRequestException("token must be json web token")

    return value
  }
}
