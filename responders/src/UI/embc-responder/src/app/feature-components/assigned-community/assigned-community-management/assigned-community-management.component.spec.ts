import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCommunityManagementComponent } from './assigned-community-management.component';

describe('CommunityManagementComponent', () => {
  let component: AssignedCommunityManagementComponent;
  let fixture: ComponentFixture<AssignedCommunityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedCommunityManagementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedCommunityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
