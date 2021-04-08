import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartcopyComponent } from './chartcopy.component';

describe('ChartComponent', () => {
  let component: ChartcopyComponent;
  let fixture: ComponentFixture<ChartcopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartcopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartcopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
