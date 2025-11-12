import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPdfCompletoComponent } from './formulario-pdf-completo.component';

describe('FormularioPdfCompletoComponent', () => {
  let component: FormularioPdfCompletoComponent;
  let fixture: ComponentFixture<FormularioPdfCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioPdfCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPdfCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
