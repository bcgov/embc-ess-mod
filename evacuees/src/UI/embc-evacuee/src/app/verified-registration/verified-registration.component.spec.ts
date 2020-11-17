import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedRegistrationComponent } from './verified-registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('VerifiedRegistrationComponent', () => {
  let component: VerifiedRegistrationComponent;
  let fixture: ComponentFixture<VerifiedRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedRegistrationComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
