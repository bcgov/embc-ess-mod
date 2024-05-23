import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserProfileComponent } from './view-user-profile.component';
import { provideRouter } from '@angular/router';

describe('UserProfileComponent', () => {
  let component: ViewUserProfileComponent;
  let fixture: ComponentFixture<ViewUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ViewUserProfileComponent],
      providers: [DatePipe, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
