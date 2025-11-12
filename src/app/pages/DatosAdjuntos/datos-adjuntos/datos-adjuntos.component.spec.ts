import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAdjuntosComponent } from './datos-adjuntos.component';

describe('DatosAdjuntosComponent', () => {
  let component: DatosAdjuntosComponent;
  let fixture: ComponentFixture<DatosAdjuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosAdjuntosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAdjuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
