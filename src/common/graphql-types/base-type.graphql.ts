import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseType {
  @Field()
  _id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}