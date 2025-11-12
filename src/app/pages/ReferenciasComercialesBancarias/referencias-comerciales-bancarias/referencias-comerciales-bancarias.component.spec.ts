import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenciasComercialesBancariasComponent } from './referencias-comerciales-bancarias.component';

describe('ReferenciasComercialesBancariasComponent', () => {
  let component: ReferenciasComercialesBancariasComponent;
  let fixture: ComponentFixture<ReferenciasComercialesBancariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenciasComercialesBancariasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenciasComercialesBancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
