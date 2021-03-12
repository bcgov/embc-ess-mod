import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberDetailComponent } from './team-member-detail.component';

describe('TeamMemberDetailComponent', () => {
  let component: TeamMemberDetailComponent;
  let fixture: ComponentFixture<TeamMemberDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
