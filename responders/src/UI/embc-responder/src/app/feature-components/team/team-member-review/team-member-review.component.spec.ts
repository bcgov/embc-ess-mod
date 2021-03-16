import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberReviewComponent } from './team-member-review.component';

describe('TeamMemberReviewComponent', () => {
  let component: TeamMemberReviewComponent;
  let fixture: ComponentFixture<TeamMemberReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
