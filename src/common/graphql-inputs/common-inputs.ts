import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteOneInputType {
  @Field({ nullable: false })
  @IsMongoId()
  _id: string;
}

@InputType()
export class GetOneInputType {
  @Field({ nullable: false })
  @IsMongoId()
  _id: string;
}