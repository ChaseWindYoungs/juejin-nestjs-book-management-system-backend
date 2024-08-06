import { DbService } from './../db/db.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

function randomNumber(): number {
  const num = Math.random() * 10000000000000;
  return parseInt(num.toString().slice(0, 12));
}

@Injectable()
export class BookService {
  @Inject()
  dbService: DbService;

  async list(name: string) {
    const books: Book[] = await this.dbService.read();
    console.log(name);
    if (name) {
      return books.filter((i) => i.name.includes(name));
    }
    return books;
  }
  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find((i) => i.id === id);
  }

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const book = new Book();
    book.id = randomNumber();
    book.author = createBookDto.author;
    book.name = createBookDto.name;
    book.description = createBookDto.description;
    book.cover = createBookDto.cover;
    books.push(book);
    await this.dbService.write(books);
    return book;
  }
  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const foundBook = books.find((i) => i.id === updateBookDto.id);
    if (!foundBook) {
      throw new BadRequestException('该图书不存在');
    }
    foundBook.author = updateBookDto.author;
    foundBook.name = updateBookDto.name;
    foundBook.description = updateBookDto.description;
    foundBook.cover = updateBookDto.cover;
    await this.dbService.write(books);
    return foundBook;
  }
  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((i) => i.id === id);
    if (index != -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
    }
  }
}
