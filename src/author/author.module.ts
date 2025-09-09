import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { BookModule } from 'src/book/book.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Author]),
    forwardRef(() => BookModule), // <-- wrap with forwardRef
  ],
  providers: [AuthorService, AuthorResolver],
  exports: [TypeOrmModule, AuthorService],
})
export class AuthorModule {}

