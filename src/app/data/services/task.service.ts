import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CategoryService, Category } from './category.service';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  categoryId: number;
  categoryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  public tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private categoryService: CategoryService
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const storedTasks = await this._storage.get('tasks');
    if (storedTasks) {
      this.tasks = storedTasks;
      this.tasksSubject.next(this.tasks);
    }
  }

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  async addTask(title: string, categoryId: number = 1) {
    const categories = await firstValueFrom(
      this.categoryService.getCategories()
    );

    const selectedCategory = categories
      ? categories.find((c) => c.id === categoryId)
      : undefined;
    const categoryName = selectedCategory ? selectedCategory.name : 'Ninguna';

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
      categoryId,
      categoryName,
    };

    this.tasks.push(newTask);
    await this.saveTasks(); // Guardar las tareas
    this.tasksSubject.next(this.tasks); // Notificar los cambios
  }

  async removeTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    await this.saveTasks();
  }

  async toggleTask(id: number) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      await this.saveTasks();
    }
  }
  toggleTaskCompletion(taskId: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex > -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.tasksSubject.next(this.tasks); // Actualizar la lista de tareas
      this.saveTasks(); // Guardar los cambios si es necesario
    }
  }

  private async saveTasks() {
    await this._storage?.set('tasks', this.tasks);
    this.tasksSubject.next(this.tasks);
  }
}
