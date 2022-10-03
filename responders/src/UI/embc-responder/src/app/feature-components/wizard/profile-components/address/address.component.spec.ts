import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { AddressComponent } from './address.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { computeInterfaceToken } from 'src/app/app.module';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { MockAppBaseService } from 'src/app/unit-tests/mockAppBase.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { LocationsService } from 'src/app/core/services/locations.service';
import { MockLocationService } from 'src/app/unit-tests/mockLocation.service';
import { AddressService } from './address.service';
import { MockAddressService } from 'src/app/unit-tests/mockAddress.service';
import { Router } from '@angular/router';
import { _MatRadioButtonBase } from '@angular/material/radio';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({ selector: 'app-bc-address', template: '' })
class BcAddressStubComponent {}

@Component({ selector: 'app-can-address', template: '' })
class CanadaAddressStubComponent {}

@Component({ selector: 'app-usa-address', template: '' })
class UsaAddressStubComponent {}

@Component({ selector: 'app-other-address', template: '' })
class OtherAddressStubComponent {}

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let locationService;
  let appBaseService;
  let addressService;

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
      declarations: [
        AddressComponent,
        BcAddressStubComponent,
        CanadaAddressStubComponent,
        UsaAddressStubComponent,
        OtherAddressStubComponent
      ],
      providers: [
        UntypedFormBuilder,
        { provide: computeInterfaceToken, useValue: {} },
        {
          provide: AppBaseService,
          useClass: MockAppBaseService
        },
        {
          provide: LocationsService,
          useClass: MockLocationService
        },
        {
          provide: AddressService,
          useClass: MockAddressService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    locationService = TestBed.inject(LocationsService);
    addressService = TestBed.inject(AddressService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display all the input elements of the form group', () => {
    fixture.detectChanges();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#primaryAddressForm'
    );
    const totalElems = formElem.querySelectorAll('input');
    expect(totalElems.length).toEqual(4);
  });

  it('primary address form should display default values', () => {
    addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      community: '',
      country: '',
      stateProvince: ''
    };
    fixture.detectChanges();
    component.ngOnInit();

    const primaryAddressForm = component.primaryAddressForm.get('address');
    const formValues = {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      community: '',
      country: '',
      stateProvince: ''
    };
    expect(primaryAddressForm.getRawValue()).toEqual(formValues);
  });

  it('mailing address form should display default values', () => {
    addressService.stepEvacueeProfileService.mailingAddressDetailsVal = {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      community: '',
      country: '',
      stateProvince: ''
    };
    fixture.detectChanges();
    component.ngOnInit();

    const mailingAddressForm =
      component.primaryAddressForm.get('mailingAddress');
    const formValues = {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      community: '',
      country: '',
      stateProvince: ''
    };
    expect(mailingAddressForm.getRawValue()).toEqual(formValues);
  });

  it('should navigate to EVACUEE DETAILS PAGE on back', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      addressService.stepEvacueeProfileService.profileTabsValue =
        addressService.stepEvacueeProfileService.evacueeProfileTabs;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.back();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/evacuee-details'
      ]);
    })
  ));

  it('should navigate to CONTACTS PAGE on next', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();

      addressService.stepEvacueeProfileService.profileTabsValue =
        addressService.stepEvacueeProfileService.evacueeProfileTabs;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();

      expect(router.navigate).toHaveBeenCalledWith([
        '/ess-wizard/evacuee-profile/contact'
      ]);
    })
  ));

  it('form should display INCOMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: false
      };
      addressService.stepEvacueeProfileService.profileTabsValue =
        addressService.stepEvacueeProfileService.evacueeProfileTabs;
      addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        community: '',
        country: '',
        stateProvince: ''
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      addressService.cleanup(component.primaryAddressForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        addressService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'address'
        );

      expect(tabMetaData.status).toEqual('not-started');
    })
  ));

  it('form should display COMPLETE tab status', fakeAsync(
    inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.stub();
      appBaseService.wizardProperties = {
        editFlag: true
      };
      addressService.stepEvacueeProfileService.profileTabsValue =
        addressService.stepEvacueeProfileService.evacueeProfileTabs;

      addressService.stepEvacueeProfileService.isBcAddressVal = 'Yes';
      addressService.stepEvacueeProfileService.isMailingAddressSameAsPrimaryAddressVal =
        'Yes';
      addressService.stepEvacueeProfileService.isBcMailingAddressVal = 'Yes';
      addressService.stepEvacueeProfileService.mailingAddressDetailsVal = {
        addressLine1: '1',
        addressLine2: '2',
        postalCode: '',
        community: {
          name: '100 Mile House',
          districtName: 'Cariboo',
          isActive: true,
          type: 'Community'
        },
        country: { code: 'CAN', name: 'Canada' },
        stateProvince: { code: 'BC', name: 'British Columbia' }
      };
      addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
        addressLine1: '1',
        addressLine2: '2',
        postalCode: '',
        community: {
          name: '100 Mile House',
          districtName: 'Cariboo',
          isActive: true,
          type: 'Community'
        },
        country: { code: 'CAN', name: 'Canada' },
        stateProvince: { code: 'BC', name: 'British Columbia' }
      };
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
      component.next();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();

      tick();
      addressService.cleanup(component.primaryAddressForm);
      fixture.detectChanges();

      tick();
      flush();
      flushMicrotasks();
      discardPeriodicTasks();
      const tabMetaData =
        addressService.stepEvacueeProfileService.profileTabs.find(
          (tab) => tab.name === 'address'
        );

      expect(tabMetaData.status).toEqual('complete');
    })
  ));

  it('should set the mailing address same as primary address', () => {
    addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
      addressLine1: '1',
      addressLine2: '2',
      postalCode: '',
      community: {
        name: '100 Mile House',
        districtName: 'Cariboo',
        isActive: true,
        type: 'Community'
      },
      country: { code: 'CAN', name: 'Canada' },
      stateProvince: { code: 'BC', name: 'British Columbia' }
    };
    fixture.detectChanges();
    component.sameAsPrimary({
      source: {} as _MatRadioButtonBase,
      value: 'Yes'
    });
    const primaryAddress = component.primaryAddressForm.get('address').value;
    const mailingAddress =
      component.primaryAddressForm.get('mailingAddress').value;
    expect(primaryAddress).toEqual(mailingAddress);
  });

  it('should set the mailing address to default value', () => {
    addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
      addressLine1: '1',
      addressLine2: '2',
      postalCode: '',
      community: {
        name: '100 Mile House',
        districtName: 'Cariboo',
        isActive: true,
        type: 'Community'
      },
      country: { code: 'CAN', name: 'Canada' },
      stateProvince: { code: 'BC', name: 'British Columbia' }
    };
    fixture.detectChanges();
    component.mailingAddressChange({
      source: {} as _MatRadioButtonBase,
      value: 'Yes'
    });
    const primaryAddress = component.primaryAddressForm.get('address').value;
    const mailingAddress =
      component.primaryAddressForm.get('mailingAddress').value;
    expect(primaryAddress).not.toEqual(mailingAddress);
  });

  it('should set the mailing address to default value', () => {
    addressService.stepEvacueeProfileService.primaryAddressDetailsVal = {
      addressLine1: '1',
      addressLine2: '2',
      postalCode: '',
      community: {
        name: '100 Mile House',
        districtName: 'Cariboo',
        isActive: true,
        type: 'Community'
      },
      country: { code: 'CAN', name: 'Canada' },
      stateProvince: { code: 'BC', name: 'British Columbia' }
    };
    fixture.detectChanges();
    component.primaryAddressChange({
      source: {} as _MatRadioButtonBase,
      value: 'Yes'
    });
    const primaryAddress = component.primaryAddressForm.get('address').value;

    expect(primaryAddress).not.toEqual(
      addressService.stepEvacueeProfileService.primaryAddressDetailsVal
    );
  });

  it('should display BC address form for primary address', () => {
    addressService.stepEvacueeProfileService.isBcAddressVal = 'Yes';
    fixture.detectChanges();
    component.ngOnInit();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const formElem = nativeElem.querySelector('app-bc-address');
    expect(formElem).toBeDefined();
  });

  it('should display select country field is primary address in BC is selcted No', () => {
    addressService.stepEvacueeProfileService.isBcAddressVal = 'No';
    fixture.detectChanges();
    component.ngOnInit();
    const formElem = fixture.debugElement.nativeElement.querySelector(
      '#primaryAddressForm'
    );
    const totalElems = formElem.querySelectorAll('mat-autocomplete');
    expect(totalElems.length).toEqual(1);
  });

  it('should display canada address form if the country selected is Canada', () => {
    addressService.stepEvacueeProfileService.isBcAddressVal = 'No';
    fixture.detectChanges();
    component.ngOnInit();

    component.primaryAddressForm
      .get('address.country')
      .setValue({ code: 'CAN', name: 'Canada' });
    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const formElem = nativeElem.querySelector('app-can-address');
    expect(formElem).toBeDefined();
  });

  it('should display usa address form if the country selected is usa', () => {
    addressService.stepEvacueeProfileService.isBcAddressVal = 'No';
    fixture.detectChanges();
    component.ngOnInit();

    component.primaryAddressForm
      .get('address.country')
      .setValue({ code: 'USA', name: 'United States of America' });
    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const formElem = nativeElem.querySelector('app-usa-address');
    expect(formElem).toBeDefined();
  });

  it('should display other address form if the country selected is neither Canada or Usa', () => {
    addressService.stepEvacueeProfileService.isBcAddressVal = 'No';
    fixture.detectChanges();
    component.ngOnInit();

    component.primaryAddressForm
      .get('address.country')
      .setValue({ code: 'AUS', name: 'Australia' });
    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const formElem = nativeElem.querySelector('app-other-address');
    expect(formElem).toBeDefined();
  });
});
