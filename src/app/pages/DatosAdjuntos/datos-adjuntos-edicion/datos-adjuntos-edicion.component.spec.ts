import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAdjuntosEdicionComponent } from './datos-adjuntos-edicion.component';

describe('DatosAdjuntosEdicionComponent', () => {
  let component: DatosAdjuntosEdicionComponent;
  let fixture: ComponentFixture<DatosAdjuntosEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosAdjuntosEdicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAdjuntosEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
