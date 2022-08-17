import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { VerifiedRegistrationComponent } from './verified-registration.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeoutService } from 'src/app/core/services/timeout.service';
import { MockTimeoutService } from 'src/app/unit-tests/mockTimeout.service';
import { MockExpiry } from 'src/app/unit-tests/mockExpiry.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatDialogModule } from '@angular/material/dialog';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('VerifiedRegistrationComponent', () => {
  let app: VerifiedRegistrationComponent;
  let fixture: ComponentFixture<VerifiedRegistrationComponent>;
  let component: VerifiedRegistrationComponent;
  let timeoutService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VerifiedRegistrationComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NgIdleKeepaliveModule.forRoot(),
        MatDialogModule,
        OAuthModule.forRoot()
      ],
      providers: [
        UntypedFormBuilder,
        VerifiedRegistrationComponent,
        {
          provide: TimeoutService,
          useClass: MockTimeoutService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedRegistrationComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(VerifiedRegistrationComponent);
    timeoutService = TestBed.inject(TimeoutService);
  });

  it('should create', () => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1,
      warningMessageDuration: 1
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('should initiate time out service', () => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1,
      warningMessageDuration: 1
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(timeoutService.getState()).toEqual('Started');
  });

  it('should have an active session', () => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1,
      warningMessageDuration: 1
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(timeoutService.getTimeOut()).toEqual(false);
  });

  it('should set idle time', () => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1,
      warningMessageDuration: 1
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    component.ngOnInit();
    expect(idle.getIdle()).toEqual(60);
  });

  it('should set timeout time', () => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1,
      warningMessageDuration: 1
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    component.ngOnInit();
    expect(idle.getTimeout()).toEqual(60);
  });

  it('should not be idle', fakeAsync(() => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1 / 60,
      warningMessageDuration: 1 / 60
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    component.ngOnInit();

    expiry.mockNow = new Date();
    idle.watch();
    expect(idle.isIdling()).toEqual(false);

    idle.stop();
  }));

  it('should be idle', fakeAsync(() => {
    timeoutService.timeOutInfoVal = {
      sessionTimeoutInMinutes: 1 / 60,
      warningMessageDuration: 1 / 60
    };
    fixture.detectChanges();
    const idle = timeoutService.idle;
    const expiry: MockExpiry = TestBed.inject(MockExpiry);
    component.ngOnInit();

    idle.watch();
    expiry.mockNow = new Date(expiry.now().getTime() + idle.getIdle() * 1000);
    tick(3000);

    expect(idle.isIdling()).toBe(true);

    idle.stop();
  }));
});
