import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetertreeComponent } from './metertree.component';

describe('MetertreeComponent', () => {
  let component: MetertreeComponent;
  let fixture: ComponentFixture<MetertreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetertreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetertreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
