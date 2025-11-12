import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRegistroTiempoComponent } from './list-registro-tiempo.component';

describe('ListRegistroTiempoComponent', () => {
  let component: ListRegistroTiempoComponent;
  let fixture: ComponentFixture<ListRegistroTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListRegistroTiempoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRegistroTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
