import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  book_name: string;

  @Field(() => Int)
  author_id: number;  // foreign key reference
}

