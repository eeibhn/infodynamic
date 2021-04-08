import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iIntellComponent } from './iIntell.component';

describe('iIntellComponent', () => {
  let component: iIntellComponent;
  let fixture: ComponentFixture<iIntellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ iIntellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(iIntellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
