import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoListasInspektorComponent } from './resultado-listas-inspektor.component';

describe('ResultadoListasInspektorComponent', () => {
  let component: ResultadoListasInspektorComponent;
  let fixture: ComponentFixture<ResultadoListasInspektorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultadoListasInspektorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoListasInspektorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
