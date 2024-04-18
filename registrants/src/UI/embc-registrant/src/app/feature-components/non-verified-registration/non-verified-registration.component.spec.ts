import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('NonVerifiedRegistrationComponent', () => {
  let component: NonVerifiedRegistrationComponent;
  let fixture: ComponentFixture<NonVerifiedRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, NonVerifiedRegistrationComponent],
      providers: [UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonVerifiedRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
