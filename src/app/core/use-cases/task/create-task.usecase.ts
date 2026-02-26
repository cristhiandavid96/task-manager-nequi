// src/app/core/use-cases/task/create-task.usecase.ts
import { Task } from '../../entities/task';
import { TaskRepository } from '../../interfaces/task-repository.interface';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    await this.taskRepository.createTask(task);
  }
}
