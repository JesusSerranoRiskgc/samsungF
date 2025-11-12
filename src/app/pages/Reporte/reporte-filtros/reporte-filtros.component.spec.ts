import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFiltrosComponent } from './reporte-filtros.component';

describe('ReporteFiltrosComponent', () => {
  let component: ReporteFiltrosComponent;
  let fixture: ComponentFixture<ReporteFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteFiltrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
