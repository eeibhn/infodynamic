import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportselectorComponent } from './reportselector.component';

describe('ReportselectorComponent', () => {
  let component: ReportselectorComponent;
  let fixture: ComponentFixture<ReportselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
