import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseType } from '../../common/graphql-types/base-type.graphql';
import { IsOptional, Length } from 'class-validator';
import { IUser } from '../user/user.interface';
import { PublicUserType } from '../user/user.graphql';
import { IPost } from './post.interface';

@ObjectType()
export class PostType extends BaseType {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  ownerId: string;
}

@ObjectType()
export class PostCreatedType {
  @Field(() => PublicUserType)
  user: IUser;

  @Field(() => PostType)
  post: IPost;
}

@InputType()
export class CreatePostInputType {
  @Field({ nullable: false })
  @Length(2, 128)
  title: string;

  @Length(2, 10000)
  @Field({ nullable: false })
  content: string;
}

@InputType()
export class UpdatePostInputType {
  @Field({ nullable: true })
  @IsOptional()
  @Length(2, 128)
  title: string;

  @Length(2, 10000)
  @IsOptional()
  @Field({ nullable: true })
  content: string;
}