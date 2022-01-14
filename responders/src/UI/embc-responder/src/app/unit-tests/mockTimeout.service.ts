import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { TimeoutConfiguration } from '../core/api/models';
import { TimeoutService } from '../core/services/timeout.service';
import { MockAuthService } from './mockAuth.service';
import { MockUserService } from './mockUser.service';

@Injectable({
  providedIn: 'root'
})
export class MockTimeoutService extends TimeoutService {
  public timedOut = false;
  public timeOutInfoVal: TimeoutConfiguration;
  private state = 'Started';

  constructor(
    public idle: Idle,
    public dialog: MatDialog,
    public authenticationService: MockAuthService,
    public userService: MockUserService
  ) {
    super(idle, dialog, authenticationService, userService);
  }

  init(idleTime: number, timeOutDuration: number) {
    this.idle.setIdle(idleTime * 60);
    this.idle.setTimeout(timeOutDuration * 60);

    this.idle.onIdleStart.subscribe(() => {
      this.state = 'Idle';
    });

    this.idle.onTimeout.subscribe(() => {
      this.timedOut = true;
    });
  }

  getState(): string {
    return this.state;
  }

  getTimeOut(): boolean {
    return this.timedOut;
  }

  public get timeOutInfo(): TimeoutConfiguration {
    return this.timeOutInfoVal;
  }
  public set timeOutInfo(value: TimeoutConfiguration) {
    this.timeOutInfoVal = value;
  }
}
