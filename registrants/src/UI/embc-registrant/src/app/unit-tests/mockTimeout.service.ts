import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Idle } from '@ng-idle/core';
import { TimeoutConfiguration } from '../core/api/models';
import { CacheService } from '../core/services/cache.service';
import { LoginService } from '../core/services/login.service';
import { TimeoutService } from '../core/services/timeout.service';

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
    public loginService: LoginService,
    public cacheService: CacheService
  ) {
    super(idle, dialog, loginService, cacheService);
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
