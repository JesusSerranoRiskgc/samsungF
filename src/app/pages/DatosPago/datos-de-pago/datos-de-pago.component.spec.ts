import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDePagoComponent } from './datos-de-pago.component';

describe('DatosDePagoComponent', () => {
  let component: DatosDePagoComponent;
  let fixture: ComponentFixture<DatosDePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosDePagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
