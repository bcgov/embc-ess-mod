import {
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
  ComponentFixture
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
import { of, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({ selector: 'app-environment-banner', template: '' })
class EnvironmentBannerStubComponent {}

@Component({ selector: 'app-outage-banner', template: '' })
class OutageBannerStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let timeoutService;
  let bannerService;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let outageService;
  let configService;
  let authService;
  // let routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  //const mockOutageSubscription: Subscription = of(true).subscribe();
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
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
          //{ provide: Router, useValue: routerSpy },
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
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(AppComponent);
    timeoutService = TestBed.inject(TimeoutService);
    bannerService = TestBed.inject(EnvironmentBannerService);
    outageService = TestBed.inject(OutageService);
    configService = TestBed.inject(ConfigService);
    authService = TestBed.inject(AuthenticationService);
  });

  it('should create the app', () => {
    configService.config = {
      timeoutInfo: {
        sessionTimeoutInMinutes: 1,
        warningMessageDuration: 1
      },
      outageInfo: null
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('should initiate time out service', () => {
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

  // it('should navigate ', () => {
  //   const spy = routerSpy.calls;
  //   configService.config = {
  //     timeoutInfo: {
  //       sessionTimeoutInMinutes: 1,
  //       warningMessageDuration: 1
  //     },
  //     outageInfo: null
  //   };
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['responder-access']);
  // });

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

    tick();
    fixture.detectChanges();

    expect(component.environment.bannerTitle).toContain(
      bannerService.getEnvironmentBanner().bannerTitle
    );
  }));

  it('should display environment banner', () => {
    bannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toBeDefined();
  });

  it('should not display environment banner if environment value is undefined', () => {
    bannerService.environmentBanner = undefined;
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toEqual(null);
  });

  it('should not display environment banner if environment value is null', () => {
    bannerService.environmentBanner = {};
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const envBannerElem = nativeElem.querySelector('app-environment-banner');
    expect(envBannerElem).toEqual(null);
  });

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
    fixture.detectChanges();
    component.ngOnInit();

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
    fixture.detectChanges();
    component.ngOnInit();

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
    fixture.detectChanges();
    component.ngOnInit();

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
    fixture.detectChanges();
    component.ngOnInit();

    tick();
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
    fixture.detectChanges();
    component.ngOnInit();

    tick();
    fixture.detectChanges();

    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const outageBannerElem = nativeElem.querySelector('app-outage-banner');
    expect(outageBannerElem).toEqual(null);
  }));
});
