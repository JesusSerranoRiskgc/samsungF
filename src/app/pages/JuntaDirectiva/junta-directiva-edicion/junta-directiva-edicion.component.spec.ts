import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuntaDirectivaEdicionComponent } from './junta-directiva-edicion.component';

describe('JuntaDirectivaEdicionComponent', () => {
  let component: JuntaDirectivaEdicionComponent;
  let fixture: ComponentFixture<JuntaDirectivaEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JuntaDirectivaEdicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuntaDirectivaEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
