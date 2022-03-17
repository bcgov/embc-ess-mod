import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from './core/services/login.service';
import { BootstrapService } from './core/services/bootstrap.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { APP_BASE_HREF } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatDialogModule } from '@angular/material/dialog';
import { MockEnvironmentBannerService } from './unit-tests/mockEnvironmentBanner.service';
import { ConfigService } from './core/services/config.service';

@Component({ selector: 'app-header', template: '' })
class HeaderStubComponent {}

@Component({ selector: 'app-footer', template: '' })
class FooterStubComponent {}

@Component({ selector: 'app-environment-banner', template: '' })
class EnvironmentBannerStubComponent {}

describe('AppComponent', () => {
  let loginService: jasmine.SpyObj<LoginService>;
  let bootstrapService: jasmine.SpyObj<BootstrapService>;
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let bannerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        OAuthModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        MatDialogModule
      ],
      declarations: [
        AppComponent,
        HeaderStubComponent,
        FooterStubComponent
        // EnvironmentBannerStubComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        AppComponent,
        { provides: LoginService, useValue: loginService },
        { provides: BootstrapService, useValue: bootstrapService },
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ConfigService,
          useClass: MockEnvironmentBannerService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(AppComponent);
    bannerService = TestBed.inject(ConfigService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should display application header', () => {
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const headerElem = nativeElem.querySelector('app-header');
    expect(headerElem).toBeDefined();
  });

  it('should display application footer', () => {
    const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
    const footerElem = nativeElem.querySelector('app-FOOTER');
    expect(footerElem).toBeDefined();
  });

  it('should have environment name', waitForAsync(() => {
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
  }));

  it('should have environment banner subtitle', waitForAsync(() => {
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
  }));

  it('should have environment banner title', waitForAsync(() => {
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
  }));

  it('should not display environment banner if environment value is undefined', waitForAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.environment).toBeUndefined();
    });
  }));

  it('should not display environment banner if environment value is null', waitForAsync(() => {
    bannerService.environmentBanner = null;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.environment).toBeNull();
    });
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

  // it(
  //   'should not display environment banner if its null',
  //   waitForAsync(() => {
  //     bannerService.environmentBanner = null;
  //     fixture.detectChanges();
  //     component.ngOnInit();
  //     fixture.whenStable().then(() => {
  //       const nativeElem: HTMLElement = fixture.debugElement.nativeElement;
  //       const envBannerElem = nativeElem.querySelector(
  //         'app-environment-banner'
  //       );
  //       expect(envBannerElem).toBeNull();
  //     });
  //   })
  // );
});
