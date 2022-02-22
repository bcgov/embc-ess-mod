import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { VersionInformation } from './core/api/models/version-information';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfigService } from './core/services/config.service';
import { LocationsService } from './core/services/locations.service';
import { UserService } from './core/services/user.service';
import { AlertService } from './shared/components/alert/alert.service';
import * as globalConst from './core/services/global-constants';
import { LoadTeamListService } from './core/services/load-team-list.service';
import { EnvironmentInformation } from './core/models/environment-information.model';
import { TimeoutService } from './core/services/timeout.service';
import { OutageService } from './feature-components/outage/outage.service';
import { EnvironmentBannerService } from './core/layout/environment-banner/environment-banner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public show = true;
  public version: Array<VersionInformation>;
  public environment: EnvironmentInformation;
  public pollingInterval: Subscription;

  constructor(
    public envBannerService: EnvironmentBannerService,
    public outageService: OutageService,
    private configService: ConfigService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private locationService: LocationsService,
    private loadTeamListService: LoadTeamListService,
    private timeOutService: TimeoutService
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.show = !e.url.startsWith('/ess-wizard', 0);
      }
    });
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.environment = await this.envBannerService.loadEnvironmentBanner();
      const configuration = await this.configService.load();
      // console.log(configuration);
      this.outageService.outageInfo = configuration.outageInfo;
      this.outageService.setOutageInformation(configuration.outageInfo);
      this.timeOutService.timeOutInfo = configuration.timeoutInfo;
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.systemError);
    }

    if (this.outageService.displayOutageInfoInit()) {
      this.isLoading = false;
      this.outageService.initOutageType();
    } else {
      this.timeOutService.init(
        this.timeOutService.timeOutInfo.sessionTimeoutInMinutes,
        this.timeOutService.timeOutInfo.warningMessageDuration
      );
      try {
        const nextUrl = await this.authenticationService.login();
        const userProfile = await this.userService.loadUserProfile();
        const location = await this.locationService.loadStaticLocationLists();
        const team = await this.loadTeamListService.loadStaticTeamLists();
        this.getBackendVersionInfo();
        const nextRoute = decodeURIComponent(
          userProfile.requiredToSignAgreement
            ? 'electronic-agreement'
            : nextUrl || 'responder-access'
        );
        await this.router.navigate([nextRoute]);
      } catch (error) {
        this.isLoading = false;
        this.alertService.clearAlert();
        if (error.status === 403) {
          this.alertService.setAlert('danger', globalConst.accessError);
        } else {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.systemError);
        }
      } finally {
        this.isLoading = false;
      }
    }
    this.outageService.outagePolling();
    this.outageService.startOutageInterval();
  }

  public closeOutageBanner($event: boolean): void {
    this.outageService.setShowOutageBanner($event);
    this.outageService.closeBannerbyUser = !$event;
  }

  private getBackendVersionInfo(): void {
    this.configService.getVersionInfo().subscribe((version) => {
      this.version = version;
    });
  }
}
