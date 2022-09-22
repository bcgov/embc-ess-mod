import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import ContactInfoComponent from './contact-info.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [FormCreationService, UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
