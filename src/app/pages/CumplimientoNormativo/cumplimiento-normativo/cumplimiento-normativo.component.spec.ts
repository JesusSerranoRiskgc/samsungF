import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumplimientoNormativoComponent } from './cumplimiento-normativo.component';

describe('CumplimientoNormativoComponent', () => {
  let component: CumplimientoNormativoComponent;
  let fixture: ComponentFixture<CumplimientoNormativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CumplimientoNormativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CumplimientoNormativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
