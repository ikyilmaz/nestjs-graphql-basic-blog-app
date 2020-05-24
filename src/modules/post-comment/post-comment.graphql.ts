import { BaseType } from '../../common/graphql-types/base-type.graphql';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId, IsOptional, Length } from 'class-validator';

@ObjectType()
export class PostCommentType extends BaseType {
  @Field()
  ownerId: string;

  @Field()
  postId: string;

  @Field()
  content: string;
}

@InputType()
export class CreatePostCommentInput {
  @Field({ nullable: false })
  @IsMongoId()
  postId: string;

  @Field({ nullable: false })
  @Length(2, 256)
  content: string;
}

@InputType()
export class UpdatePostCommentInput {
  @Field({ nullable: true })
  @Length(2, 256)
  @IsOptional()
  content: string;
}