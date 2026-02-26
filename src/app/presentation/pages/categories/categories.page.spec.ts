import { TestBed } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';
import { CategoryService } from 'src/app/data/services/category.service'; // Asegúrate de que la ruta sea correcta
import { Storage } from '@ionic/storage-angular';

class StorageMock {
  private store: { [key: string]: any } = {};

  async create() {
    // Simula la creación del almacenamiento
    return Promise.resolve();
  }

  async set(key: string, value: any) {
    this.store[key] = value;
    return Promise.resolve();
  }

  async get(key: string) {
    return Promise.resolve(this.store[key] || null);
  }

  async remove(key: string) {
    delete this.store[key];
    return Promise.resolve();
  }
}

describe('CategoriesPage', () => {
  let component: CategoriesPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      providers: [
        CategoryService,
        { provide: Storage, useClass: StorageMock } // Proveer el mock de Storage
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
