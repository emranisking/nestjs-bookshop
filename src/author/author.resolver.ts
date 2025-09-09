import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { AddAuthorInput } from './dto/addauthor';


@Resolver(of => Author)
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  // Query to get all authors with their books
  @Query(() => [Author], { name: 'authors' })
  async getAuthors(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  // Query to get a single author by ID
  @Query(() => Author, { name: 'author' })
  async getAuthor(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Author> {
    return this.authorService.findOne(id);
  }

  @Query(() => [Author], { name: 'authors' })
  findAuthors(
    @Args('author_name', { type: () => String, nullable: true }) author_name?: string,
    @Args('email', { type: () => String, nullable: true }) email?: string,
  ): Promise<Author[]> {
    return this.authorService.findAuthors(author_name, email);
  }

  // Mutation to create an author (optionally with books)
  @Mutation(() => Author, { name: 'addAuthor' })
  async addAuthor(
@Args('addAuthorInput') addAuthorInput: AddAuthorInput
  ): Promise<Author> {
    return this.authorService.addAuthor(addAuthorInput);
  }
}
