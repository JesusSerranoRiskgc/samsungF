import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProveedoresClientesComponent } from './formulario-proveedores-clientes.component';

describe('FormularioProveedoresClientesComponent', () => {
  let component: FormularioProveedoresClientesComponent;
  let fixture: ComponentFixture<FormularioProveedoresClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioProveedoresClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProveedoresClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
