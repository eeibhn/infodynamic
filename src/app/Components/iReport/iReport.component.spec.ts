import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iReportComponent } from './iReport.component';

describe('iReportComponent', () => {
  let component: iReportComponent;
  let fixture: ComponentFixture<iReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
