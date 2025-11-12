import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionistasComponent } from './accionistas.component';

describe('AccionistasComponent', () => {
  let component: AccionistasComponent;
  let fixture: ComponentFixture<AccionistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccionistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccionistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
