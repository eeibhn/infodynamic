import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iDashComponent } from './iDash.component';

describe('iDashComponent', () => {
  let component: iDashComponent;
  let fixture: ComponentFixture<iDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
