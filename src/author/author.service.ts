import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Book } from 'src/book/entities/book.entity';
import { AddAuthorInput } from './dto/addauthor';
import { CreateBookInput } from 'src/book/dto/create-book-input';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // Create an author (optionally with books)
  async addAuthor(addAuthorInput: AddAuthorInput): Promise<Author> {
    const { author_name, email, books } = addAuthorInput;

    const newAuthor = this.authorRepository.create({ author_name, email });
    const savedAuthor = await this.authorRepository.save(newAuthor);

    if (books && books.length > 0) {
      const bookEntities: Book[] = books.map((b: CreateBookInput) =>
        this.bookRepository.create({ book_name: b.book_name, author: savedAuthor }),
      );
      await this.bookRepository.save(bookEntities);
    }

    const authorWithBooks = await this.authorRepository.findOne({
      where: { author_id: savedAuthor.author_id },
      relations: ['books'],
    });

    if (!authorWithBooks) {
      throw new NotFoundException('Author not found after creation');
    }

    return authorWithBooks;
  }

    async findAuthors(author_name?: string, email?: string): Promise<Author[]> {
    const query = this.authorRepository.createQueryBuilder('author');

    if (author_name) {
      query.andWhere('author.author_name ILIKE :author_name', { author_name: `%${author_name}%` });
    }

    if (email) {
      query.andWhere('author.email ILIKE :email', { email: `%${email}%` });
    }

    return query.getMany();
  }

  // Get all authors
  async findAll(): Promise<Author[]> {
    return this.authorRepository.find({ relations: ['books'] });
  }

  // Get single author by id
  async findOne(author_id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { author_id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${author_id} not found`);
    }

    return author;
  }
}
