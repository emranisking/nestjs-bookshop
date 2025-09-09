import { InputType, Field } from '@nestjs/graphql';
import { CreateBookInput } from 'src/book/dto/create-book-input';


@InputType()
export class AddAuthorInput {
  @Field()
  author_name: string;

  @Field()
  email: string;

  @Field(() => [CreateBookInput], { nullable: true })
  books?: CreateBookInput[];
}
