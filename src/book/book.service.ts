import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from 'src/author/entities/author.entity';
import { CreateBookInput } from './dto/create-book-input';


@Injectable()
export class BookService {
  create(arg0: { author: Author; book_name: string; }) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Create a book only if the author exists
  async addBook(createBookInput: CreateBookInput): Promise<Book> {
    const { book_name, author_id } = createBookInput;

    // 1. Find the author
    const author = await this.authorRepository.findOne({
      where: { author_id },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    // 2. Create new book
    const newBook = this.bookRepository.create({
      book_name,
      author,
    });

    await this.bookRepository.save(newBook);

    // 3. Update author’s totalBooks count
    author.totalBooks += 1;
    await this.authorRepository.save(author);

    return newBook;
  }

  // Get all books
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['author'] });
  }

  // Get a single book by ID
  async findOne(book_id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { book_id }, relations: ['author'] });
    if (!book) {
      throw new NotFoundException(`Book with id ${book_id} not found`);
    }
    return book;
  }

  async findByAuthor(author_id: number): Promise<Book[]> {
    const correctBooks = await this.bookRepository.find({
      where: { author: {  author_id } }, // check the correct foreign key
      relations: ['author'],
    });

    if (correctBooks.length === 0) {
      throw new NotFoundException(`This author has no books yet.`);
    }

    return correctBooks;
  }


}
