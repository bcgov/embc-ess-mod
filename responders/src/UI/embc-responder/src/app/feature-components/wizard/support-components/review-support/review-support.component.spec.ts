import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSupportComponent } from './review-support.component';

describe('ReviewSupportComponent', () => {
  let component: ReviewSupportComponent;
  let fixture: ComponentFixture<ReviewSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewSupportComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
