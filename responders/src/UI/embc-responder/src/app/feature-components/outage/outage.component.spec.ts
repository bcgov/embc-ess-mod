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
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MockOutageService } from 'src/app/unit-tests/mockOutage.service';

import { OutageComponent } from './outage.component';
import { OutageService } from './outage.service';

describe('OutageComponent', () => {
  let component: OutageComponent;
  let fixture: ComponentFixture<OutageComponent>;
  let outageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule,
        OAuthModule.forRoot()
      ],
      declarations: [OutageComponent],
      providers: [
        OutageComponent,
        {
          provide: OutageService,
          useClass: MockOutageService
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageComponent);
    component = fixture.componentInstance;
    outageService = TestBed.inject(OutageService);
  });

  it('should create', () => {
    outageService.outageInfo = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    outageService.outageState = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display outage Info', fakeAsync(() => {
    outageService.outageInfo = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    outageService.outageState = true;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(component.outageInfo.content).toEqual(
      'Outage testing in Responders portal'
    );
  }));

  it('should display outage Start Date', fakeAsync(() => {
    outageService.outageInfoValue = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    outageService.outageState = true;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(component.outageInfo.outageStartDate).toEqual(
      '2021-12-15T21:00:00Z'
    );
  }));

  it('should display outage End Date', fakeAsync(() => {
    outageService.outageInfoValue = {
      content: 'Outage testing in Responders portal',
      outageStartDate: '2021-12-15T21:00:00Z',
      outageEndDate: '2021-12-16T21:00:00Z'
    };
    outageService.outageState = true;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(component.outageInfo.outageEndDate).toEqual('2021-12-16T21:00:00Z');
  }));

  it('should display unplanned outage', fakeAsync(() => {
    outageService.outageInfoValue = {
      content: 'Unplanned Outage testing in Responders portal',
      outageStartDate: null,
      outageEndDate: null
    };
    outageService.outageState = false;
    fixture.detectChanges();
    component.ngOnInit();

    flush();
    flushMicrotasks();
    discardPeriodicTasks();

    tick();
    fixture.detectChanges();

    expect(component.outageInfo.content).toEqual(
      'Unplanned Outage testing in Responders portal'
    );
  }));
});
