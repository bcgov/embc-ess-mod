import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMemberComponent } from './household-member.component';

describe('HouseholdMemberComponent', () => {
  let component: HouseholdMemberComponent;
  let fixture: ComponentFixture<HouseholdMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
