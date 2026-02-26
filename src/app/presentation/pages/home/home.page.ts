import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from 'src/app/data/services/task.service';
import { CategoryService, Category } from 'src/app/data/services/category.service';
import { map, Observable, of } from 'rxjs';
import { FeatureFlagService } from 'src/app/data/services/feature-flag.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public newFeatureEnabled: boolean = false;

  tasks$: Observable<Task[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  filteredTasks$: Observable<Task[]> = of([]); // Lista de tareas filtradas
  taskTitle: string = '';
  selectedCategoryId: number | null = null;
  filterCategoryId: number | null = null; // Categoría seleccionada para el filtro


  constructor(private taskService: TaskService,private featureFlagService: FeatureFlagService, private categoryService: CategoryService) {}

  async ngOnInit() {
    this.tasks$ = this.taskService.getTasks();
    this.categories$ = this.categoryService.getCategories();
    this.filteredTasks$ = this.tasks$;
    this.newFeatureEnabled = await this.featureFlagService.isNewFeatureEnabled();
    // Filtrar tareas si cambia la lista original de tareas
    this.tasks$.subscribe(tasks => {
      this.applyFilter(tasks);
    });
  }

  filterTasks() {
    // Obtener las tareas actuales y aplicar el filtro basado en la categoría seleccionada
    this.tasks$.subscribe(tasks => {
      this.applyFilter(tasks);
    });
  }

  private applyFilter(tasks: Task[]) {
    if (this.filterCategoryId) {
      // Filtrar por la categoría seleccionada
      this.filteredTasks$ = of(tasks.filter(task => task.categoryId === this.filterCategoryId));
    } else {
      // Mostrar todas las tareas si no hay filtro seleccionado
      this.filteredTasks$ = of(tasks);
    }
  }

  ionViewWillEnter() {
    this.tasks$ = this.taskService.getTasks();
  }

  async addTask() {
    if (this.taskTitle.trim() && this.selectedCategoryId !== null) {
      await this.taskService.addTask(this.taskTitle, this.selectedCategoryId);
      this.taskTitle = '';
      this.selectedCategoryId = null;
    } else {
      alert('Por favor, ingrese un título de tarea y seleccione una categoría.');
    }
  }
  
  async toggleTaskCompletion(id: number) {
    await this.taskService.toggleTaskCompletion(id);
  }
 async removeTask(id: number) {
   await this.taskService.removeTask(id);
  }

 async toggleTask(id: number) {
    await this.taskService.toggleTask(id);
  }
}
