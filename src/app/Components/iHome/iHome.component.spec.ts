import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iHomeComponent } from './iHome.component';

describe('iHomeComponent', () => {
  let component: iHomeComponent;
  let fixture: ComponentFixture<iHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
