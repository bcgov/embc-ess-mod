import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { MockOutageService } from 'src/app/unit-tests/mockOutage.service';
import { OutageBannerComponent } from './outage-banner.component';
import { Component } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('OutageBannerComponent', () => {
  let component: OutageBannerComponent;
  let fixture: ComponentFixture<OutageBannerComponent>;
  let outageBanner: OutageBannerComponent;
  let outageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule,
        OAuthModule.forRoot()
      ],
      declarations: [OutageBannerComponent],
      providers: [
        OutageBannerComponent,
        {
          provide: OutageService,
          useClass: MockOutageService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageBannerComponent);
    outageBanner = fixture.componentInstance;
    component = TestBed.inject(OutageBannerComponent);
    outageService = TestBed.inject(OutageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display outage Info', () => {
    outageService.outageInfoValue = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(outageService.outageInfo.content).toEqual(
      'Outage testing in Responders portal'
    );
  });

  it('should display outage Start Date', () => {
    outageService.outageInfoValue = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };

    fixture.detectChanges();
    component.ngOnInit();

    expect(outageService.outageInfo.outageStartDate).toEqual(
      '2021-12-15T21:00:00Z'
    );
  });

  it('should display outage End Date', () => {
    outageService.outageInfoValue = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    fixture.detectChanges();
    component.ngOnInit();

    expect(outageService.outageInfo.outageEndDate).toEqual(
      '2021-12-16T21:00:00Z'
    );
  });
});
