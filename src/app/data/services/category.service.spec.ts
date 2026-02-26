import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
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
describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: Storage, useClass: StorageMock }  // Proveer el mock
      ]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
