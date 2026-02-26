// src/app/core/interfaces/task-repository.interface.ts
import { Task } from '../entities/task';

export interface TaskRepository {
  getTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
}
