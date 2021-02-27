import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityReviewComponent } from './assigned-community-review.component';

describe('AssignedCommunityReviewComponent', () => {
  let component: AssignedCommunityReviewComponent;
  let fixture: ComponentFixture<AssignedCommunityReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedCommunityReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedCommunityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
