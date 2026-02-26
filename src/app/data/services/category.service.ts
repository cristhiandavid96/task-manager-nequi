import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const storedCategories = await this._storage.get('categories');
    if (storedCategories && storedCategories.length > 0) {
      this.categories = storedCategories;
    } else {
      // Crear categoría por defecto "Ninguna" si no hay categorías
      this.categories = [{ id: Date.now(), name: 'Ninguna' }];
      await this.saveCategories();
    }
    this.categoriesSubject.next(this.categories);
  }

  getCategories() {
    return this.categoriesSubject.asObservable();
  }

  async addCategory(name: string) {
    const newCategory: Category = {
      id: Date.now(),
      name,
    };
    this.categories.push(newCategory);
    await this.saveCategories();
  }

  async editCategory(id: number, newName: string) {
    const category = this.categories.find(cat => cat.id === id);
    if (category) {
      category.name = newName;
      await this.saveCategories();
    }
  }

  async removeCategory(id: number) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    await this.saveCategories();
  }

  private async saveCategories() {
    await this._storage?.set('categories', this.categories);
    this.categoriesSubject.next(this.categories);
  }
}
