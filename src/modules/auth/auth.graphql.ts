import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsAlpha, IsOptional, Length } from 'class-validator';
import { IUser } from '../user/user.interface';
import { PublicUserType } from '../user/user.graphql';
import { PostType } from '../post/post.graphql';


@ObjectType()
export class PrivateUserType {

  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: false })
  username: string;

}

@ObjectType()
export class OnCommentMyPostsType {
  @Field(() => PublicUserType)
  user: PublicUserType;

  @Field(() => PostType)
  post: PostType;
}

@ObjectType()
export class SignUpType {
  @Field()
  token: string;

  @Field(() => PublicUserType)
  user: IUser;
}

@ObjectType()
export class SignInType {
  @Field()
  token: string;

  @Field(() => PublicUserType)
  user: IUser;
}

@InputType()
export class SignUpInputType {
  @Field({ nullable: false })
  @IsAlpha()
  username: string;

  @Field({ nullable: false })
  @Length(6, 32)
  password: string;
}

@InputType()
export class SignInInputType {
  @Field({ nullable: true })
  @IsAlpha()
  @IsOptional()
  username: string;

  @Field({ nullable: true })
  @Length(6, 32)
  @IsOptional()
  password: string;
}