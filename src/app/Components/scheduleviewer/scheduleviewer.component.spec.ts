import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleviewerComponent } from './scheduleviewer.component';

describe('ScheduleviewerComponent', () => {
  let component: ScheduleviewerComponent;
  let fixture: ComponentFixture<ScheduleviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
