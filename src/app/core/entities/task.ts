// src/app/core/entities/task.ts
export class Task {
    constructor(
      public id: string,
      public title: string,
      public completed: boolean,
      public categoryId: string,
      public categoryName: string,
    ) {}
  }
  