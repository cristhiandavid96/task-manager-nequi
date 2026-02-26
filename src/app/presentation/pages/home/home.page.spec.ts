import { TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { TaskService } from 'src/app/data/services/task.service'; // Asegúrate de que la ruta sea correcta
import { Storage } from '@ionic/storage-angular';
import { FeatureFlagService } from 'src/app/data/services/feature-flag.service'; // Asegúrate de que la ruta sea correcta
import { RemoteConfig } from '@angular/fire/remote-config';
class RemoteConfigMock {
  private values: { [key: string]: any } = {};

  async fetch() {
    // Simula la recuperación de configuraciones remotas
    return Promise.resolve();
  }

  async activate() {
    // Simula la activación de las configuraciones
    return Promise.resolve(true);
  }

  getString(key: string) {
    return this.values[key] || null; // Devuelve el valor simulado
  }

  setDefaults(defaults: { [key: string]: any }) {
    this.values = { ...this.values, ...defaults };
  }
}

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

describe('HomePage', () => {
  let component: HomePage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        TaskService,
        FeatureFlagService,
        { provide: RemoteConfig, useClass: RemoteConfigMock } ,
        TaskService,
        { provide: Storage, useClass: StorageMock } // Proveer el mock de Storage
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});