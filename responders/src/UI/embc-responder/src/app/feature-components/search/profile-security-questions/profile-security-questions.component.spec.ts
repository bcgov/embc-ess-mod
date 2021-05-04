import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSecurityQuestionsComponent } from './profile-security-questions.component';

describe('ProfileSecurityQuestionsComponent', () => {
  let component: ProfileSecurityQuestionsComponent;
  let fixture: ComponentFixture<ProfileSecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileSecurityQuestionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
