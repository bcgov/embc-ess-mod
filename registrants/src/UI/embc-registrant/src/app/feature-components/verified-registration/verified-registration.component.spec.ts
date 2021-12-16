import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { VerifiedRegistrationComponent } from './verified-registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

  beforeEach(
    waitForAsync(() => {
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
          FormBuilder,
          VerifiedRegistrationComponent,
          {
            provide: TimeoutService,
            useClass: MockTimeoutService
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedRegistrationComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(VerifiedRegistrationComponent);
    timeoutService = TestBed.inject(TimeoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
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
});
