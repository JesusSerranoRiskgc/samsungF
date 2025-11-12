import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFormulariosClienteComponent } from './lista-formularios-cliente.component';

describe('ListaFormulariosClienteComponent', () => {
  let component: ListaFormulariosClienteComponent;
  let fixture: ComponentFixture<ListaFormulariosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaFormulariosClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFormulariosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
