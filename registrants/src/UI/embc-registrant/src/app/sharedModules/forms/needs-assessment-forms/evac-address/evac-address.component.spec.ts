import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import EvacAddressComponent from './evac-address.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from '../../../../core/services/formCreation.service';

describe('EvacAddressComponent', () => {
  let component: EvacAddressComponent;
  let fixture: ComponentFixture<EvacAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvacAddressComponent],
      imports: [ReactiveFormsModule],
      providers: [FormCreationService, UntypedFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
