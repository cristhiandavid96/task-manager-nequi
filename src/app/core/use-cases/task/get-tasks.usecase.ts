// src/app/core/use-cases/task/get-tasks.usecase.ts
import { Task } from '../../entities/task';
import { TaskRepository } from '../../interfaces/task-repository.interface';

export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }
}
