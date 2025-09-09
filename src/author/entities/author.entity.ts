import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  author_id: number;

  @Field()
  @Column()
  author_name: string;

  @Field()
  @Column({ unique: true }) // ✅ new column
  email: string;

  // One author can have many books
  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
    id: any;
}
