import { Injectable } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import * as moment from 'moment';
import { OutageDialogComponent } from 'src/app/shared/outage-components/outage-dialog/outage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/core/api/services';
import { Observable } from 'rxjs/internal/Observable';
import {
  BehaviorSubject,
  share,
  Subject,
  switchMap,
  takeUntil,
  timer
} from 'rxjs';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import * as globalConst from '../../core/services/global-constants';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class OutageService {
  showOutageBanner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public showOutageBanner$: Observable<boolean> =
    this.showOutageBanner.asObservable();

  private outageInfoVal: null | OutageInformation;
  private closeBannerbyUserVal = false;
  private stopPolling = new Subject();

  constructor(
    public dialog: MatDialog,
    public configService: ConfigService,
    public alertService: AlertService,
    public router: Router
  ) {}

  public get outageInfo(): OutageInformation {
    return this.outageInfoVal;
  }
  public set outageInfo(value: OutageInformation) {
    this.outageInfoVal = value;
  }

  public setShowOutageBanner(showbanner: boolean): void {
    return this.showOutageBanner.next(showbanner);
  }

  public getShowOutageBanner(): Observable<boolean> {
    return this.showOutageBanner$;
  }

  public get closeBannerbyUser(): boolean {
    return this.closeBannerbyUserVal;
  }
  public set closeBannerbyUser(value: boolean) {
    this.closeBannerbyUserVal = value;
  }

  public displayOutageInfoInit(): boolean {
    if (this.outageInfo !== null) {
      const now = new Date();
      const outageStart = new Date(this.outageInfoVal?.outageStartDate);
      const outageEnd = new Date(this.outageInfoVal?.outageEndDate);
      return (
        moment(outageStart).isSameOrBefore(now) &&
        moment(outageEnd).isSameOrAfter(now)
      );
    }
    return false;
  }

  public routeOutageInfo(): void {
    if (this.outageInfo !== null) {
      const now = new Date();
      const outageStart = new Date(this.outageInfoVal?.outageStartDate);
      const outageEnd = new Date(this.outageInfoVal?.outageEndDate);
      if (moment(outageStart).isBefore(now) && moment(outageEnd).isAfter(now)) {
        this.stopPolling.next(true);
        this.router.navigate(['/outage']);
      }
    } else if (this.outageInfo === null && this.router.url === '/outage') {
      this.router.navigate(['/responder-access']);
    }
  }

  public displayOutageBanner(): void {
    if (this.outageInfo !== null && this.closeBannerbyUser === false) {
      const now = new Date();
      const outageStart = new Date(this.outageInfo.outageStartDate);
      this.setShowOutageBanner(moment(outageStart).isAfter(now));
    } else {
      this.setShowOutageBanner(false);
    }
  }

  public openOutageDialog(): void {
    if (this.outageInfo !== null) {
      const now = moment();
      const outageStart = moment(this.outageInfo.outageStartDate);
      const duration = moment.duration(outageStart.diff(now));
      if (duration.asMinutes() <= 5 && duration.asMinutes() > 0) {
        this.dialog.open(OutageDialogComponent, {
          data: { message: this.outageInfo, time: 5 },
          maxHeight: '100%',
          width: '556px',
          maxWidth: '100%'
        });
      }
    }
  }

  public outagePolling(): void {
    timer(1000, 300000)
      .pipe(
        switchMap(() => this.getOutageConfig()),
        share(),
        takeUntil(this.stopPolling)
      )
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.outageInfo = response;
          this.displayOutageBanner();
          this.routeOutageInfo();
          this.openOutageDialog();
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.systemError);
        }
      });
  }

  private getOutageConfig(): Observable<OutageInformation> {
    return this.configService.getOutageConfig();
  }
}
