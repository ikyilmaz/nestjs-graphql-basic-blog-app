import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {

}
