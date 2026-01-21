import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto | any): Promise<Todo> {
    // Map explicitly so newly-added optional fields (note/workTime) are persisted reliably
    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      note: createTodoDto.note,
      workTime: createTodoDto.workTime,
    });
    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    return await this.todoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto | any): Promise<Todo> {
    await this.todoRepository.update(id, {
      ...updateTodoDto,
      updatedAt: new Date(),
    });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}

