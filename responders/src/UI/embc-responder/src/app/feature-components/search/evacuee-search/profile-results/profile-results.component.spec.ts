import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResultsComponent } from './profile-results.component';

describe('ProfileResultsComponent', () => {
  let component: ProfileResultsComponent;
  let fixture: ComponentFixture<ProfileResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileResultsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
