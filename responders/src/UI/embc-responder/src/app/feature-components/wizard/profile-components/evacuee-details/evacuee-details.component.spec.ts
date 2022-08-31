import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvacueeDetailsComponent } from './evacuee-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { EvacueeDetailsService } from './evacuee-details.service';
import { MockEvacueeDetailsService } from 'src/app/unit-tests/mockEvacueeDetails.service';

describe('EvacueeDetailsComponent', () => {
  let component: EvacueeDetailsComponent;
  let fixture: ComponentFixture<EvacueeDetailsComponent>;
  let appBaseService;
  let detailsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [EvacueeDetailsComponent],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: EvacueeDetailsService,
          useClass: MockEvacueeDetailsService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvacueeDetailsComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    detailsService = TestBed.inject(EvacueeDetailsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display all the input elements of the form group', () => {
    fixture.detectChanges();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#evacueeDetailsForm'
    );
    const totalElems = formElem.querySelectorAll('input');
    expect(totalElems.length).toEqual(5);
  });

  it('should display gender form control as a dropdown', () => {
    fixture.detectChanges();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#evacueeDetailsForm'
    );
    const totalElems = formElem.querySelectorAll('mat-select');
    expect(totalElems.length).toEqual(1);
  });

  // it('form should display default values', () => {
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   const evacueeForm = component.evacueeDetailsForm;
  //   const formValues = {
  //     firstName: null,
  //     lastName: null,
  //     preferredName: '',
  //     initials: '',
  //     gender: '',
  //     dateOfBirth: null
  //   };
  //   expect(evacueeForm.getRawValue()).toEqual(formValues);
  // });

  it('form should display saved form values if the user is editing profile', () => {
    appBaseService.wizardProperties = {
      editFlag: true
    };

    fixture.detectChanges();
    component.ngOnInit();

    fixture.detectChanges();
    const evacueeForm = component.evacueeDetailsForm;
    const formValues = {
      firstName: 'Unit',
      lastName: 'Test',
      preferredName: 'T',
      gender: 'F',
      initials: 'U.T',
      dateOfBirth: '01/01/2000'
    };
    expect(evacueeForm.getRawValue()).toEqual(formValues);
  });
});
