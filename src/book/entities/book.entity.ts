import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from 'src/author/entities/author.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  book_id: number;

  @Field()
  @Column()
  book_name: string;

  // Many books belong to one author
  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' }) // foreign key in DB
  author: Author;

  @Field()
  @Column({ type: 'date', default: () => 'CURRENT_DATE' }) // <-- auto current date
  publication_date: string;
}
