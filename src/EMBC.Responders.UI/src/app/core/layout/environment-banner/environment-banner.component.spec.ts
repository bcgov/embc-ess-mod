import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockEnvironmentBannerService } from 'src/app/unit-tests/mockEnvironmentBanner.service';

import { EnvironmentBannerComponent } from './environment-banner.component';
import { EnvironmentBannerService } from './environment-banner.service';

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent;
  let fixture: ComponentFixture<EnvironmentBannerComponent>;
  let envBanner: EnvironmentBannerComponent;
  let envBannerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [EnvironmentBannerComponent],
      providers: [
        EnvironmentBannerComponent,
        {
          provide: EnvironmentBannerService,
          useClass: MockEnvironmentBannerService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentBannerComponent);
    envBanner = fixture.componentInstance;
    component = TestBed.inject(EnvironmentBannerComponent);
    envBannerService = TestBed.inject(EnvironmentBannerService);
  });

  it('should create', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display environment Name', () => {
    envBannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.environment.envName).toContain(
      envBannerService.getEnvironmentBanner().envName
    );
  });

  it('should display environment title', () => {
    envBannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.environment.bannerTitle).toContain(
      envBannerService.getEnvironmentBanner().bannerTitle
    );
  });

  it('should display environment subtitle', () => {
    envBannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.environment.bannerSubTitle).toContain(
      envBannerService.getEnvironmentBanner().bannerSubTitle
    );
  });

  it('should display environment color', () => {
    envBannerService.environmentBanner = {
      envName: 'dev',
      bannerTitle:
        'You are in the **DEV** version of the **Evacuee Registration & Assistance Tool**.',
      bannerSubTitle:
        'All information entered here will be treated as **dev** data.',
      bannerColor: '#097d8c'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.environment.bannerColor).toContain(
      envBannerService.getEnvironmentBanner().bannerColor
    );
  });
});
