import { TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class ActivatedRouteMock {
  // Puedes agregar otros parámetros que necesites simular
  params = of({}); // Simula los parámetros de la ruta
}
describe('TabsComponent', () => {
  let component: TabsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabsComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }  // Proveer el mock
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
