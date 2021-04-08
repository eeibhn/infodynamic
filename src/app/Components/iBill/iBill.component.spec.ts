import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iBillComponent } from './iBill.component';

describe('ViBillComponent', () => {
  let component: iBillComponent;
  let fixture: ComponentFixture<iBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
