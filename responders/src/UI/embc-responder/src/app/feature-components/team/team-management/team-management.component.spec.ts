import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagementComponent } from './team-management.component';

describe('ResponderManagementComponent', () => {
  let component: TeamManagementComponent;
  let fixture: ComponentFixture<TeamManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
