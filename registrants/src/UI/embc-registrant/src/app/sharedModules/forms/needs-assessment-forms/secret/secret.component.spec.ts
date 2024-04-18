import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import SecretComponent from './secret.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('SecretComponent', () => {
  let component: SecretComponent;
  let fixture: ComponentFixture<SecretComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SecretComponent],
      providers: [FormCreationService, UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
