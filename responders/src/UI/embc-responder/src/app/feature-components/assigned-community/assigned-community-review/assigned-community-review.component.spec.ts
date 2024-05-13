import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityReviewComponent } from './assigned-community-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AssignedCommunityReviewComponent', () => {
  let component: AssignedCommunityReviewComponent;
  let fixture: ComponentFixture<AssignedCommunityReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AssignedCommunityReviewComponent],
      providers: [provideRouter([])]
    }).compileComponents();
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
