import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { AddAuthorInput } from './dto/addauthor';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  // Query to get authors with optional filters + pagination
  @Query(() => [Author], { name: 'authors' })
  async getAuthors(
    @Args('author_name', { type: () => String, nullable: true }) authorName?: string,
    @Args('email', { type: () => String, nullable: true }) email?: string,
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 5,
  ): Promise<Author[]> {
    return this.authorService.findAll({ authorName, email, page, limit });
  }

  // Query to get a single author by ID
  @Query(() => Author, { name: 'author' })
  async getAuthor(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Author> {
    return this.authorService.findOne(id);
  }

  // Mutation to create an author (optionally with books)
  @Mutation(() => Author, { name: 'addAuthor' })
  async addAuthor(
    @Args('addAuthorInput') addAuthorInput: AddAuthorInput
  ): Promise<Author> {
    return this.authorService.addAuthor(addAuthorInput);
  }
}
