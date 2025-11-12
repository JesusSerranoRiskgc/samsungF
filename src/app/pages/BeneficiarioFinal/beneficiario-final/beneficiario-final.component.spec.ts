import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioFinalComponent } from './beneficiario-final.component';

describe('BeneficiarioFinalComponent', () => {
  let component: BeneficiarioFinalComponent;
  let fixture: ComponentFixture<BeneficiarioFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiarioFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiarioFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
