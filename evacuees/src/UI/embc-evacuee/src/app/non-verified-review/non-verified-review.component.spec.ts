import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonVerifiedReviewComponent } from './non-verified-review.component';

describe('NonVerifiedReviewComponent', () => {
  let component: NonVerifiedReviewComponent;
  let fixture: ComponentFixture<NonVerifiedReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonVerifiedReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonVerifiedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
