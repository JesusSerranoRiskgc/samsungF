import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProovedoresClienteEdicionComponent } from './formulario-proovedores-cliente-edicion.component';

describe('FormularioProovedoresClienteEdicionComponent', () => {
  let component: FormularioProovedoresClienteEdicionComponent;
  let fixture: ComponentFixture<FormularioProovedoresClienteEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioProovedoresClienteEdicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProovedoresClienteEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
