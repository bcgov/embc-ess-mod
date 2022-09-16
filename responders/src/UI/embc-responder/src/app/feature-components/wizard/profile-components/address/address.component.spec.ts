import { ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let locationService;
  let appBaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [AddressComponent],
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
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    appBaseService = TestBed.inject(AppBaseService);
    locationService = TestBed.inject(LocationsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
