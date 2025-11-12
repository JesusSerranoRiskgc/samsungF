import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespachoDeMercanciaComponent } from './despacho-de-mercancia.component';

describe('DespachoDeMercanciaComponent', () => {
  let component: DespachoDeMercanciaComponent;
  let fixture: ComponentFixture<DespachoDeMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DespachoDeMercanciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespachoDeMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
