import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBillComponent } from './search-bill.component';

describe('SearchBillComponent', () => {
  let component: SearchBillComponent;
  let fixture: ComponentFixture<SearchBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
