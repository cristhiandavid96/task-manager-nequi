import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/data/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: Category[] = []; // Cambiar a un array normal para almacenar las categorías
  categoryName: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  async addCategory() {
    if (this.categoryName.trim()) {
      await this.categoryService.addCategory(this.categoryName);
      this.categoryName = '';
    }
  }

  async editCategory(category: Category) {
    const newName = prompt("Editar categoría:", category.name);
    if (newName) {
      await this.categoryService.editCategory(category.id, newName);
    }
  }

  async removeCategory(id: number) {
    await this.categoryService.removeCategory(id);
  }
}
