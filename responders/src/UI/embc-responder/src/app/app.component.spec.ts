import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeoutService } from './core/services/timeout.service';
import { MockTimeoutService } from './unit-tests/mockTimeout.service';
import { MockExpiry } from './unit-tests/mockExpiry.service';
import { EnvironmentBannerService } from './core/layout/environment-banner/environment-banner.service';
import { MockEnvironmentBannerService } from './unit-tests/mockEnvironmentBanner.service';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { OutageService } from './feature-components/outage/outage.service';
import { MockOutageService } from './unit-tests/mockOutage.service';

@Component({ selector: 'app-environment-banner', template: '' })
class EnvironmentBannerStubComponent {}

@Component({ selector: 'app-outage-banner', template: '' })
class OutageBannerStubComponent {}

describe('AppComponent', () => {
  let component;
  let timeoutService;
  let bannerService;
  let fixture;
  let app;
  let outageService;
  const mockOutageSubscription: Subscription = of(true).subscribe();
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          OAuthModule.forRoot(),
          NgIdleKeepaliveModule.forRoot(),
          MatDialogModule,
          OAuthModule.forRoot()
        ],
        declarations: [
          AppComponent,
          EnvironmentBannerStubComponent,
          OutageBannerStubComponent
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          AppComponent,
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
  });

  // afterEach(() => {
  //   fixture.destroy();
  // });

  it('should create the app', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('should initiate time out service', () => {
    fixture.detectChanges();
    timeoutService.init(1, 1);
    expect(timeoutService.getState()).toEqual('Started');
  });

  it('should have an active session', () => {
    fixture.detectChanges();
    timeoutService.init(1, 1);
    expect(timeoutService.getTimeOut()).toEqual(false);
  });

  it('should set idle time', () => {
    fixture.detectChanges();
    const idle = timeoutService.idle;
    timeoutService.init(1, 1);
    expect(idle.getIdle()).toEqual(60);
  });

  it('should set timeout time', () => {
    fixture.detectChanges();
    const idle = timeoutService.idle;
    timeoutService.init(1, 1);
    expect(idle.getTimeout()).toEqual(60);
  });

  it('should not be idle', fakeAsync(() => {
    fixture.detectChanges();
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    timeoutService.init(1 / 60, 1 / 60);

    expiry.mockNow = new Date();
    idle.watch();
    expect(idle.isIdling()).toEqual(false);

    idle.stop();
  }));

  it('should be idle', fakeAsync(() => {
    fixture.detectChanges();
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    timeoutService.init(1 / 60, 1 / 60);

    idle.watch();
    expiry.mockNow = new Date(expiry.now().getTime() + idle.getIdle() * 1000);
    tick(3000);

    expect(idle.isIdling()).toBe(true);

    idle.stop();
  }));

  it(
    'should have environment name',
    waitForAsync(() => {
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
      fixture.whenStable().then(() => {
        expect(component.environment.envName).toContain(
          bannerService.getEnvironmentBanner().envName
        );
      });
    })
  );

  it(
    'should have environment banner subtitle',
    waitForAsync(() => {
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
      fixture.whenStable().then(() => {
        expect(component.environment.bannerSubTitle).toContain(
          bannerService.getEnvironmentBanner().bannerSubTitle
        );
      });
    })
  );

  it(
    'should have environment banner title',
    waitForAsync(() => {
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
      fixture.whenStable().then(() => {
        expect(component.environment.bannerTitle).toContain(
          bannerService.getEnvironmentBanner().bannerTitle
        );
      });
    })
  );

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

  // it('should not display environment banner if environment value is null', () => {
  //   bannerService.environmentBanner = {
  //     envName: null,
  //     bannerTitle: null,
  //     bannerSubTitle: null,
  //     bannerColor: null
  //   };
  //   fixture.detectChanges();
  //   const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
  //   const envBannerElem = nativeElem.querySelector('app-environment-banner');
  //   console.log(nativeElem);
  //   expect(envBannerElem).toEqual(null);
  // });

  // it('should display outage Info', () => {
  //   outageService.outageInformation = {
  //     content: 'Outage testing in Responders portal',
  //     outageStartDate: '2021-12-15T21:00:00Z',
  //     outageEndDate: '2021-12-16T21:00:00Z'
  //   };
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   console.log(component);
  //   expect(component.outageInformation.content).toContain(
  //     outageService.getOutageInformation().content
  //   );
  // });

  // it('should have an outage start date', () => {
  //   outageService.outageInformation = {
  //     content: 'Outage testing in Responders portal',
  //     outageStartDate: '2021-12-15T21:00:00Z',
  //     outageEndDate: '2021-12-16T21:00:00Z'
  //   };
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   expect(component.outageInformation.outageStartDate).toContain(
  //     outageService.getOutageInformation().outageStartDate
  //   );
  // });

  // it('should have an outage end date', () => {
  //   outageService.outageInformation = {
  //     content: 'Outage testing in Responders portal',
  //     outageStartDate: '2021-12-15T21:00:00Z',
  //     outageEndDate: '2021-12-16T21:00:00Z'
  //   };
  //   fixture.detectChanges();
  //   component.ngOnInit();
  //   expect(component.outageService.outageInformation.outageEndDate).toContain(
  //     outageService.getOutageInformation().outageEndDate
  //   );
  // });

  it('should display outage banner', () => {
    outageService.outageInformation = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const outageBannerElem = nativeElem.querySelector('app-outage-banner');
    expect(outageBannerElem).toBeDefined();
  });

  it('should not display outage banner if the outageInformation value is null', () => {
    outageService.outageInformation = null;
    fixture.detectChanges();
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const outageBannerElem = nativeElem.querySelector('app-outage-banner');
    expect(outageBannerElem).toEqual(null);
  });
});
