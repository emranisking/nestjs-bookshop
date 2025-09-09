import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

import { AuthorService } from '../author/author.service';
import { CreateBookInput } from './dto/create-book-input';

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
    private readonly authorService: AuthorService,
  ) {}

  // Get all books
  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.bookService.findAll();
  }

  // Get a book by ID
  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.findOne(id);
  }

  // Add a new book with relation to an author
  @Mutation(() => Book)
  async addBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    const { author_id, ...book_name } = createBookInput;

    if (!author_id) {
      throw new Error('author_id is required to create a book');
    }

    // Find author by ID
    const author = await this.authorService.findOne(author_id);
    if (!author) {
      throw new Error('Author not found');
    }

    // Create and save the book linked to the author
    return this.bookService.addBook({
      ...book_name,
      author_id,
    });
  }
}
