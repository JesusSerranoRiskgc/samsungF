import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuntaDirectivaComponent } from './junta-directiva.component';

describe('JuntaDirectivaComponent', () => {
  let component: JuntaDirectivaComponent;
  let fixture: ComponentFixture<JuntaDirectivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JuntaDirectivaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuntaDirectivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
