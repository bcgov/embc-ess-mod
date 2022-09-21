import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import AddressComponent from './address.component';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddressComponent],
      imports: [ReactiveFormsModule],
      providers: [FormCreationService, UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
