import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OutageComponent } from 'src/app/feature-components/outage/outage.component';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { MockOutageService } from 'src/app/unit-tests/mockOutage.service';

import { OutageBannerComponent } from './outage-banner.component';

describe('OutageBannerComponent', () => {
  let component: OutageBannerComponent;
  let fixture: ComponentFixture<OutageBannerComponent>;
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
        OutageComponent,
        {
          provide: OutageService,
          useClass: MockOutageService
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageBannerComponent);
    component = fixture.componentInstance;
    outageService = TestBed.inject(OutageService);
  });

  it('should create', () => {
    fixture.detectChanges();
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
