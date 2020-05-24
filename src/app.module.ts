import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './modules/post/post.module';
import { PostCommentModule } from './modules/post-comment/post-comment.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurrentUserModule } from '@app/current-user';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('DB_URL'),
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        onConnect: (connectionParams: any, websocket, context) => {
          context.request.headers.authorization = connectionParams?.Authorization
        },
      },
      context: ({ req }) => ({req}),
    }),
    CurrentUserModule,

    UserModule,

    PostModule,

    PostCommentModule,

    AuthModule,

  ],
})

export class AppModule {
}
