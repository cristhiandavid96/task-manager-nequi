import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/data/services/category.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  categoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  async addCategory() {
    if (this.categoryName.trim()) {
      await this.categoryService.addCategory(this.categoryName);
      this.categoryName = '';
      await this.showToast('✓ Categoría creada', 'success');
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Nombre requerido',
        message: 'Por favor escribe un nombre para la categoría.',
        buttons: [{ text: 'Entendido', role: 'cancel' }],
        cssClass: 'nequi-alert',
      });
      await alert.present();
    }
  }

  async editCategory(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Editar categoría',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de la categoría',
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.newName && data.newName.trim()) {
              await this.categoryService.editCategory(category.id, data.newName.trim());
              await this.showToast('✓ Categoría actualizada', 'success');
            }
          }
        }
      ],
      cssClass: 'nequi-alert',
    });
    await alert.present();
  }

  async removeCategory(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar categoría?',
      message: 'Las tareas de esta categoría quedarán sin categoría.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.categoryService.removeCategory(id);
            await this.showToast('Categoría eliminada', 'danger');
          }
        }
      ],
      cssClass: 'nequi-alert',
    });
    await alert.present();
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
