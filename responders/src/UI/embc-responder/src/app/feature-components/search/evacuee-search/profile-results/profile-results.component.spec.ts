import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileResultsComponent } from './profile-results.component';

describe('ProfileResultsComponent', () => {
  let component: ProfileResultsComponent;
  let fixture: ComponentFixture<ProfileResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileResultsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
