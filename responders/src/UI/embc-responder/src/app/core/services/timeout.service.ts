import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { TimeOutDialogComponent } from 'src/app/shared/components/dialog-components/time-out-dialog/time-out-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {
  timedOut = false;

  constructor(
    public idle: Idle,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    public userService: UserService
  ) {}

  init(idleTime: number, timeOutDuration: number) {
    this.idle.setIdle(idleTime * 60);
    this.idle.setTimeout(timeOutDuration * 60);

    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      this.openTimeOutModal();
    });

    this.idle.onTimeout.subscribe(() => {
      this.timedOut = true;
      this.dialog.closeAll();
      this.userService.clearAppStorage();
      this.authenticationService.logout();
    });

    this.reset();
  }

  openTimeOutModal() {
    return this.dialog.open(DialogComponent, {
      data: {
        component: TimeOutDialogComponent,
        profileData: 1 * 60,
        idle: this.idle
      },
      width: '530px'
    });
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }
}
