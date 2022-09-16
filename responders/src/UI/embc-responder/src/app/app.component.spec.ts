import {
  TestBed,
  tick,
  waitForAsync,
  ComponentFixture,
  flush,
  flushMicrotasks,
  discardPeriodicTasks,
  fakeAsync
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeoutService } from './core/services/timeout.service';
import { MockTimeoutService } from './unit-tests/mockTimeout.service';
import { EnvironmentBannerService } from './core/layout/environment-banner/environment-banner.service';
import { MockEnvironmentBannerService } from './unit-tests/mockEnvironmentBanner.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { OutageService } from './feature-components/outage/outage.service';
import { MockOutageService } from './unit-tests/mockOutage.service';
import { ConfigService } from './core/services/config.service';
import { MockConfigService } from './unit-tests/mockConfig.service';
import { AuthenticationService } from './core/services/authentication.service';
import { MockAuthService } from './unit-tests/mockAuth.service';
import { MockExpiry } from './unit-tests/mockExpiry.service';
import { of } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { AlertService } from './shared/components/alert/alert.service';
import { MockAlertService } from './unit-tests/mockAlert.service';
import { OutageComponent } from './feature-components/outage/outage.component';
import { UserService } from './core/services/user.service';
import { MockUserService } from './unit-tests/mockUser.service';
import { ElectronicAgreementComponent } from './feature-components/electronic-agreement/electronic-agreement.component';
import { LocationsService } from './core/services/locations.service';
import { MockLocationService } from './unit-tests/mockLocation.service';
import { LoadTeamListService } from './core/services/load-team-list.service';
import { MockTeamListService } from './unit-tests/mockTeamList.service';
import { ResponderAccessComponent } from './feature-components/responder-access/responder-access.component';
import { LoadEvacueeListService } from './core/services/load-evacuee-list.service';
import { MockEvacueeListService } from './unit-tests/mockEvacueeList.service';
import { SupplierService } from './core/services/suppliers.service';
import { MockSupplierService } from './unit-tests/mockSuppliers.service';
//import { MockEventRouter } from './unit-tests/mockEventRouter.service';

@Component({ selector: 'app-environment-banner', template: '' })
class EnvironmentBannerStubComponent {}

@Component({ selector: 'app-outage-banner', template: '' })
class OutageBannerStubComponent {}

// export class MockEventRouter {
//   public ne = new NavigationStart(1, 'regular');
//   public events = of(this.ne);
// }

describe('AppComponent', () => {
  let component: AppComponent;
  let timeoutService;
  let bannerService;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let outageService;
  let configService;
  let authService;
  let alertService;
  let userService;
  let locService;
  let teamService;
  let evacueeService;
  let supplierService;
  //let router: Router;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationStart(1, 'regular'))
  };
  //const mockOutageSubscription: Subscription = of(true).subscribe();
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'outage', component: OutageComponent },
          {
            path: 'electronic-agreement',
            component: ElectronicAgreementComponent
          },
          {
            path: 'responder-access',
            component: ResponderAccessComponent
          }
        ]),
        HttpClientTestingModule,
        OAuthModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        MatDialogModule
      ],
      declarations: [
        AppComponent,
        EnvironmentBannerStubComponent,
        OutageBannerStubComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        AppComponent,
        { provide: Router, useValue: routerMock },
        {
          provide: TimeoutService,
          useClass: MockTimeoutService
        },
        {
          provide: EnvironmentBannerService,
          useClass: MockEnvironmentBannerService
        },
        {
          provide: OutageService,
          useClass: MockOutageService
        },
        {
          provide: ConfigService,
          useClass: MockConfigService
        },
        {
          provide: AuthenticationService,
          useClass: MockAuthService
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
          provide: LoadTeamListService,
          useClass: MockTeamListService
        },
        {
          provide: LoadEvacueeListService,
          useClass: MockEvacueeListService
        },
        {
          provide: SupplierService,
          useClass: MockSupplierService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(AppComponent);
    timeoutService = TestBed.inject(TimeoutService);
    bannerService = TestBed.inject(EnvironmentBannerService);
    outageService = TestBed.inject(OutageService);
    configService = TestBed.inject(ConfigService);
    authService = TestBed.inject(AuthenticationService);
    alertService = TestBed.inject(AlertService);
    userService = TestBed.inject(UserService);
    locService = TestBed.inject(LocationsService);
    teamService = TestBed.inject(LoadTeamListService);
    evacueeService = TestBed.inject(LoadEvacueeListService);
    supplierService = TestBed.inject(SupplierService);
  });

  it('should create the app', () => {
    bannerService.environmentBanner = {};
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    userService.userProfile = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User'
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('should initiate time out service', () => {
    bannerService.environmentBanner = {};
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(timeoutService.getState()).toEqual('Started');
  });

  it('should have an active session', () => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(timeoutService.getTimeOut()).toEqual(false);
  });

  it('should set idle time', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(idle.getIdle()).toEqual(60);
  }));

  it('should set timeout time', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(idle.getTimeout()).toEqual(60);
  }));

  it('should not be idle', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expiry.mockNow = new Date();
    idle.watch();
    expect(idle.isIdling()).toEqual(false);

    idle.stop();
  }));

  it('should be idle', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1 / 60,
        warningMessageDuration: 1 / 60
      },
      outageInfo: null
    };
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    component.ngOnInit();

    tick();
    fixture.detectChanges();
    expiry.mockNow = new Date(expiry.now().getTime() + idle.getIdle() * 60000);
    idle.watch();

    tick(3000);
    fixture.detectChanges();
    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    expect(idle.isIdling()).toBe(true);
    idle.stop();
  }));

  it('should have environment name', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };

    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.environment.envName).toContain(
      bannerService.getEnvironmentBanner().envName
    );
  }));

  it('should have environment banner subtitle', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.environment.bannerSubTitle).toContain(
      bannerService.getEnvironmentBanner().bannerSubTitle
    );
  }));

  it('should have environment banner title', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.environment.bannerTitle).toContain(
      bannerService.getEnvironmentBanner().bannerTitle
    );
  }));

  it('should display environment banner', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toBeDefined();
  }));

  it('should not display environment banner if environment value is undefined', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = undefined;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toEqual(null);
  }));

  it('should not display environment banner if environment value is null', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();

    component.ngOnInit();
    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toEqual(null);
  }));

  it('should display outage Info', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: {
        content: 'Outage testing in Responders portal',
        outageStartDate: '2021-12-15T21:00:00Z',
        outageEndDate: '2021-12-16T21:00:00Z'
      }
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.outageService.outageInfo.content).toEqual(
      'Outage testing in Responders portal'
    );
  }));

  it('should have an outage start date', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: {
        content: 'Outage testing in Responders portal',
        outageStartDate: '2021-12-15T21:00:00Z',
        outageEndDate: '2021-12-16T21:00:00Z'
      }
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.outageService.outageInfo.outageStartDate).toEqual(
      '2021-12-15T21:00:00Z'
    );
  }));

  it('should have an outage end date', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: {
        content: 'Outage testing in Responders portal',
        outageStartDate: '2021-12-15T21:00:00Z',
        outageEndDate: '2021-12-16T21:00:00Z'
      }
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    expect(component.outageService.outageInfo.outageEndDate).toEqual(
      '2021-12-16T21:00:00Z'
    );
  }));

  it('should display outage banner', fakeAsync(() => {
    const now = new Date();
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: {
        content: 'Outage testing in Responders portal',
        outageStartDate: now,
        outageEndDate: new Date(now.getTime() + 2 * 60000)
      }
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const outageBannerElem = nativeElem.querySelector('app-outage-banner');
    expect(outageBannerElem).toBeDefined();
  }));

  it('should not display outage banner if the outageInformation value is null', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();
    tick();
    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const outageBannerElem = nativeElem.querySelector('app-outage-banner');
    expect(outageBannerElem).toEqual(null);
  }));

  it('should navigate to EAA if user is logging for first time', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    userService.userProfile = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: true,
      userName: 'Test_User'
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['electronic-agreement']);
  }));

  it('should navigate to Responder dashboard if not a new user', fakeAsync(() => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    userService.userProfile = {
      agreementSignDate: null,
      firstName: 'Test_First_Name',
      lastName: 'Test_Last_Name',
      requiredToSignAgreement: false,
      userName: 'Test_User'
    };
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/responder-access']);
  }));

  it('should navigate to the outage page when in outage window', fakeAsync(() => {
    const now = new Date();
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: {
        content: 'Outage testing in Responders portal',
        outageStartDate: now,
        outageEndDate: new Date(now.getTime() + 2 * 60000)
      }
    };
    outageService.outageState = true;
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/outage'], {
      state: { type: 'planned' }
    });
  }));
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
