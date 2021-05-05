import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReviewComponent } from './profile-review.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileReviewComponent', () => {
  let component: ProfileReviewComponent;
  let fixture: ComponentFixture<ProfileReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProfileReviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
