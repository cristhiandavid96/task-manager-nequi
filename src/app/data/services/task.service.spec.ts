import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

class StorageMock {
  create() {}
  set(key: string, value: any) {
    return Promise.resolve();
  }
  get(key: string) {
    return Promise.resolve([]);
  }
  remove(key: string) {
    return Promise.resolve();
  }
}

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: Storage, useClass: StorageMock }
      ]
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
