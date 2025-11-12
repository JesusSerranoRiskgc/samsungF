import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaGuardadoSinValidacionComponent } from './alerta-guardado-sin-validacion.component';

describe('AlertaGuardadoSinValidacionComponent', () => {
  let component: AlertaGuardadoSinValidacionComponent;
  let fixture: ComponentFixture<AlertaGuardadoSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertaGuardadoSinValidacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaGuardadoSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
