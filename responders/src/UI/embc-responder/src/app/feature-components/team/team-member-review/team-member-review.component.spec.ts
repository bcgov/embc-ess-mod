import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberReviewComponent } from './team-member-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamMemberReviewComponent', () => {
  let component: TeamMemberReviewComponent;
  let fixture: ComponentFixture<TeamMemberReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ TeamMemberReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
