import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';

describe('NonVerifiedRegistrationComponent', () => {
  let component: NonVerifiedRegistrationComponent;
  let fixture: ComponentFixture<NonVerifiedRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonVerifiedRegistrationComponent ]
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
