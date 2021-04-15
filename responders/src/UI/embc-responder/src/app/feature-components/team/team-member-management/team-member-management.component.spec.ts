import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberManagementComponent } from './team-member-management.component';

describe('TeamMemberManagementComponent', () => {
  let component: TeamMemberManagementComponent;
  let fixture: ComponentFixture<TeamMemberManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMemberManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
