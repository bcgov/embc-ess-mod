import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('NonVerifiedRegistrationComponent', () => {
  let component: NonVerifiedRegistrationComponent;
  let fixture: ComponentFixture<NonVerifiedRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonVerifiedRegistrationComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder]
    })
    .compileComponents();
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
