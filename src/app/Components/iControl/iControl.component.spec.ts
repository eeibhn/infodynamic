import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iControlComponent } from './iControl.component';

describe('iControlComponent', () => {
  let component: iControlComponent;
  let fixture: ComponentFixture<iControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
