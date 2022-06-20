import { Injectable, NgZone } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import * as moment from 'moment';
import { OutageDialogComponent } from 'src/app/sharedModules/outage-components/outage-dialog/outage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
// import { ConfigurationService } from 'src/app/core/api/services';
import { Observable } from 'rxjs/internal/Observable';
import {
  BehaviorSubject,
  share,
  Subject,
  switchMap,
  takeUntil,
  timer
} from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import * as globalConst from 'src/app/core/services/globalConstants';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/core/services/cache.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ConfigService } from 'src/app/core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class OutageService {
  public outageInformation: BehaviorSubject<OutageInformation> =
    new BehaviorSubject<OutageInformation>(null);

  public outageInfoVal$: Observable<OutageInformation> =
    this.outageInformation.asObservable();

  public showOutageBanner: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public showOutageBanner$: Observable<boolean> =
    this.showOutageBanner.asObservable();

  private outageInfoVal: OutageInformation;
  private closeBannerbyUserVal = false;
  private stopPolling = new Subject();
  private outageDialogCounter = 0;

  constructor(
    public dialog: MatDialog,
    public configService: ConfigService,
    public alertService: AlertService,
    public router: Router,
    public loginService: LoginService,
    public cacheService: CacheService,
    private zone: NgZone
  ) {}

  public get outageInfo(): OutageInformation {
    return this.outageInfoVal;
  }
  public set outageInfo(value: OutageInformation) {
    this.outageInfoVal = value;
  }

  public setOutageInformation(outageInfo: OutageInformation): void {
    return this.outageInformation.next(outageInfo);
  }

  public getOutageInformation(): Observable<OutageInformation> {
    return this.outageInfoVal$;
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
    if (this.outageInfo) {
      if (
        this.outageInfo.outageStartDate !== null ||
        this.outageInfo.outageEndDate !== null
      ) {
        const now = new Date();
        const outageStart = new Date(this.outageInfo.outageStartDate);
        const outageEnd = new Date(this.outageInfo.outageEndDate);
        return (
          moment(outageStart).isSameOrBefore(now) &&
          moment(outageEnd).isSameOrAfter(now)
        );
      } else {
        return true;
      }
    }
    return false;
  }

  public initOutageType(): void {
    if (
      this.outageInfo.outageStartDate !== null ||
      this.outageInfo.outageEndDate !== null
    ) {
      this.router.navigate(['/outage'], { state: { type: 'planned' } });
    } else {
      this.router.navigate(['/outage'], { state: { type: 'unplanned' } });
    }
  }

  public routeOutageInfo(): void {
    if (this.outageInfo) {
      if (
        this.outageInfo.outageStartDate !== null ||
        this.outageInfo.outageEndDate !== null
      ) {
        const now = new Date();
        const outageStart = new Date(this.outageInfo?.outageStartDate);
        const outageEnd = new Date(this.outageInfo?.outageEndDate);
        if (
          moment(outageStart).isSameOrBefore(now) &&
          moment(outageEnd).isAfter(now)
        ) {
          this.stopPolling.next(true);
          this.router.navigate(['/outage'], { state: { type: 'planned' } });
        }
      } else {
        this.stopPolling.next(true);
        this.router.navigate(['/outage'], { state: { type: 'unplanned' } });
      }
    } else if (this.outageInfo === null && this.router.url === '/outage') {
      this.router.navigate(['/registration-method']);
    }
  }

  public displayOutageBanner(newOutageInfo: OutageInformation): void {
    if (
      newOutageInfo.outageEndDate !== null &&
      newOutageInfo.outageStartDate !== null
    ) {
      if (
        !this.outageInfoIsEqual(newOutageInfo) ||
        this.closeBannerbyUser === false
      ) {
        this.outageInfo = newOutageInfo;
        const now = new Date();
        const outageStart = new Date(this.outageInfo.outageStartDate);
        this.setShowOutageBanner(moment(outageStart).isAfter(now));
      } else {
        this.setShowOutageBanner(false);
      }
    } else {
      this.outageInfo = newOutageInfo;
    }
  }

  public openOutageDialog(): void {
    if (this.outageInfo) {
      const now = moment();
      const outageStart = moment(this.outageInfo.outageStartDate);
      const duration = moment.duration(outageStart.diff(now));
      if (
        duration.asMinutes() <= 5 &&
        Math.round(duration.asMinutes()) >= 4 &&
        this.outageDialogCounter === 0
      ) {
        this.dialog.open(OutageDialogComponent, {
          data: { message: this.outageInfo, time: 5 },
          maxHeight: '100%',
          width: '556px',
          maxWidth: '100%'
        });
        this.outageDialogCounter++;
      }
    }
  }

  public outagePolling(): void {
    this.zone.runOutsideAngular(() =>
      timer(1000, 300000)
        .pipe(
          switchMap(() => this.getOutageConfig()),
          share(),
          takeUntil(this.stopPolling)
        )
        .subscribe({
          next: (response) => {
            if (response !== null) {
              if (!this.outageInfoIsEqual(response)) {
                this.outageDialogCounter = 0;
              }
              this.setOutageInformation(response);
              this.displayOutageBanner(response);
            }
          },
          error: (error) => {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.systemError);
          }
        })
    );
  }

  public startOutageInterval(): void {
    this.zone.runOutsideAngular(() =>
      timer(1000, 30000)
        .pipe(share(), takeUntil(this.stopPolling))
        .subscribe(() => {
          this.routeOutageInfo();
          this.openOutageDialog();
        })
    );
  }

  public outageInfoIsEqual(newOutageInfo: OutageInformation): boolean {
    return (
      this.outageInfo.content === newOutageInfo.content &&
      this.outageInfo.outageEndDate === newOutageInfo.outageEndDate &&
      this.outageInfo.outageStartDate === newOutageInfo.outageStartDate
    );
  }

  public async signOut(): Promise<void> {
    await this.loginService.logout();
    this.cacheService.clear();
    localStorage.clear();
  }

  private getOutageConfig(): Observable<OutageInformation> {
    return this.configService.getOutageConfiguration();
  }
}
