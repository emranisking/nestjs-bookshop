import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { AuthorModule } from 'src/author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    forwardRef(() => AuthorModule), // <-- wrap with forwardRef
  ],
  providers: [BookService, BookResolver],
  exports: [TypeOrmModule, BookService],
})
export class BookModule {}
