// src/app/data/repositories/task-repository.impl.ts
import { TaskRepository } from '../../core/interfaces/task-repository.interface';
import { Task } from '../../core/entities/task';
import { Storage } from '@ionic/storage-angular';

export class TaskRepositoryImpl implements TaskRepository {
  constructor(private storage: Storage) {}

  async getTasks(): Promise<Task[]> {
    return await this.storage.get('tasks') || [];
  }

  async createTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.storage.set('tasks', tasks);
  }

  async updateTask(task: Task): Promise<void> {
    let tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks[index] = task;
      await this.storage.set('tasks', tasks);
    }
  }

  async deleteTask(id: string): Promise<void> {
    let tasks = await this.getTasks();
    tasks = tasks.filter(task => task.id !== id);
    await this.storage.set('tasks', tasks);
  }
}
