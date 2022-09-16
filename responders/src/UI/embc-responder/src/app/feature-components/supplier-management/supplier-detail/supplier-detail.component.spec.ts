import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LocationsService } from 'src/app/core/services/locations.service';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { MockAlertService } from 'src/app/unit-tests/mockAlert.service';
import { MockEditSupplierService } from 'src/app/unit-tests/mockEditSupplier.service';
import { MockLocationService } from 'src/app/unit-tests/mockLocation.service';
import { MockSupplierDetailService } from 'src/app/unit-tests/mockSupplierDetail.service';
import { MockSupplierListDataService } from 'src/app/unit-tests/mockSupplierListData.service';
import { MockSupplierService } from 'src/app/unit-tests/mockSuppliers.service';
import { MockUserService } from 'src/app/unit-tests/mockUser.service';
import { EditSupplierComponent } from '../edit-supplier/edit-supplier.component';
import { EditSupplierService } from '../edit-supplier/edit-supplier.service';
import { SupplierManagementComponent } from '../supplier-management.component';
import { SupplierListDataService } from '../suppliers-list/supplier-list-data.service';

import { SupplierDetailComponent } from './supplier-detail.component';
import { SupplierDetailService } from './supplier-detail.service';

describe('SupplierDetailComponent', () => {
  let component: SupplierDetailComponent;
  let fixture: ComponentFixture<SupplierDetailComponent>;
  let userService;
  let supplierListDataService;
  let supplierDetailService;
  let editSupplierService;
  let locationService;
  let alertService;
  let supplierService;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationStart(1, 'regular')),
    getCurrentNavigation: () => ({
      extras: { queryParams: { type: 'supplier' } }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        CustomPipeModule,
        RouterTestingModule.withRoutes([
          { path: 'suppliers-list', component: SupplierManagementComponent },
          {
            path: 'edit-supplier',
            component: EditSupplierComponent
          }
        ])
      ],
      declarations: [SupplierDetailComponent],
      providers: [
        SupplierDetailComponent,
        UntypedFormBuilder,
        {
          provide: UserService,
          useClass: MockUserService
        },
        {
          provide: SupplierListDataService,
          useClass: MockSupplierListDataService
        },
        {
          provide: SupplierDetailService,
          useClass: MockSupplierDetailService
        },
        {
          provide: EditSupplierService,
          useClass: MockEditSupplierService
        },
        {
          provide: AlertService,
          useClass: MockAlertService
        },
        {
          provide: UserService,
          useClass: MockUserService
        },
        {
          provide: LocationsService,
          useClass: MockLocationService
        },
        {
          provide: SupplierService,
          useClass: MockSupplierService
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierDetailComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    supplierDetailService = TestBed.inject(SupplierDetailService);
    supplierListDataService = TestBed.inject(SupplierListDataService);
    editSupplierService = TestBed.inject(EditSupplierService);
    locationService = TestBed.inject(LocationsService);
    alertService = TestBed.inject(AlertService);
    supplierService = TestBed.inject(SupplierService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get valid supplier type from router', () => {
    const routingTest = TestBed.inject(Router);
    const formBuilder = TestBed.inject(UntypedFormBuilder);
    const matDialog = TestBed.inject(MatDialog);
    const testMockComponent = new SupplierDetailComponent(
      formBuilder,
      routingTest,
      matDialog,
      supplierListDataService,
      userService,
      editSupplierService,
      supplierDetailService,
      locationService,
      supplierService,
      alertService
    );
    fixture.detectChanges();
    expect(testMockComponent.detailsType).toBeDefined();
  });

  it('should get valid supplier from router', () => {
    const routingTest = TestBed.inject(Router);
    const formBuilder = TestBed.inject(UntypedFormBuilder);
    const matDialog = TestBed.inject(MatDialog);
    const testMockComponent = new SupplierDetailComponent(
      formBuilder,
      routingTest,
      matDialog,
      supplierListDataService,
      userService,
      editSupplierService,
      supplierDetailService,
      locationService,
      supplierService,
      alertService
    );
    fixture.detectChanges();
    expect(testMockComponent.selectedSupplier).toBeDefined();
  });

  it('should navigate to suppliers list when selected supplier is undefined', fakeAsync(() => {
    component.selectedSupplier = undefined;
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/responder-access/supplier-management/suppliers-list'
    ]);
  }));

  it('should navigate to edit supplier', fakeAsync(() => {
    component.selectedSupplier = supplierListDataService.getSelectedSupplier();
    component.editSupplier();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/responder-access/supplier-management/edit-supplier'
    ]);
  }));
});
