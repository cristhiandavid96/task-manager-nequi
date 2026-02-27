import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService, Task } from 'src/app/data/services/task.service';
import { CategoryService, Category } from 'src/app/data/services/category.service';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { FeatureFlagService } from 'src/app/data/services/feature-flag.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public newFeatureEnabled: boolean = false;

  tasks$: Observable<Task[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  filteredTasks$: Observable<Task[]> = of([]);
  taskTitle: string = '';
  selectedCategoryId: number | null = null;
  filterCategoryId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private featureFlagService: FeatureFlagService,
    private categoryService: CategoryService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.tasks$ = this.taskService.getTasks();
    this.categories$ = this.categoryService.getCategories();
    this.filteredTasks$ = this.tasks$;
    this.newFeatureEnabled = await this.featureFlagService.isNewFeatureEnabled();

    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.applyFilter(tasks);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterTasks() {
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.applyFilter(tasks);
    });
  }

  private applyFilter(tasks: Task[]) {
    if (this.filterCategoryId) {
      this.filteredTasks$ = of(tasks.filter(task => task.categoryId === this.filterCategoryId));
    } else {
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
      await this.showToast('✓ Tarea agregada', 'success');
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Campos incompletos',
        message: 'Por favor ingresa un título y selecciona una categoría.',
        buttons: [{ text: 'Entendido', role: 'cancel' }],
        cssClass: 'nequi-alert',
      });
      await alert.present();
    }
  }

  async toggleTaskCompletion(id: number) {
    await this.taskService.toggleTaskCompletion(id);
  }

  async removeTask(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar tarea?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.removeTask(id);
            await this.showToast('Tarea eliminada', 'danger');
          }
        }
      ],
      cssClass: 'nequi-alert',
    });
    await alert.present();
  }

  async toggleTask(id: number) {
    await this.taskService.toggleTask(id);
  }

  private async showToast(message: string, color: string = 'secondary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
      cssClass: 'nequi-toast',
    });
    await toast.present();
  }
}
