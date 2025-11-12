import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazoModalComponent } from './rechazo-modal.component';

describe('RechazoModalComponent', () => {
  let component: RechazoModalComponent;
  let fixture: ComponentFixture<RechazoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RechazoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechazoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
