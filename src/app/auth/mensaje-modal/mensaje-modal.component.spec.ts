import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeModalComponent } from './mensaje-modal.component';

describe('MensajeModalComponent', () => {
  let component: MensajeModalComponent;
  let fixture: ComponentFixture<MensajeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MensajeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
