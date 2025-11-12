import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionInternaOEAComponent } from './informacion-interna-oea.component';

describe('InformacionInternaOEAComponent', () => {
  let component: InformacionInternaOEAComponent;
  let fixture: ComponentFixture<InformacionInternaOEAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacionInternaOEAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionInternaOEAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
