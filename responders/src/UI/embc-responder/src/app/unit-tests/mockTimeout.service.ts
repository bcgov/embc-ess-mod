import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { TimeoutConfiguration } from '../core/api/models';
import { AuthenticationService } from '../core/services/authentication.service';
import { TimeoutService } from '../core/services/timeout.service';
import { UserService } from '../core/services/user.service';

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
    public authenticationService: AuthenticationService,
    public userService: UserService
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
}
