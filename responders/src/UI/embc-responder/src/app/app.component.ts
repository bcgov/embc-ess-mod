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
import { OutageInformation } from './core/api/models';
import { EnvironmentBannerService } from './core/layout/environment-banner/environment-banner.service';

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
  timedOut = false;
  public showOutageBanner = false;

  constructor(
    public envBannerService: EnvironmentBannerService,
    private configService: ConfigService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private locationService: LocationsService,
    private loadTeamListService: LoadTeamListService,
    private timeOut: TimeoutService,
    private outageService: OutageService
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.show = !e.url.startsWith('/ess-wizard', 0);
      }
    });

    this.timeOut.init(1, 1);
    // this.configService.load().subscribe({
    //   next: (result) => {
    //     // this.outageService.setOutageInfo(result.outageInfo);
    //     this.outageService.setOutageInfo(result.outageInfo);
    //   }
    // });
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.environment = await this.envBannerService.getEnvironmentBanner();
      const configuration = await this.configService.load();
      this.outageService.outageInfo = configuration.outageInfo;
    } catch (error) {
      this.router.navigate(['/outage']);
    }

    if (this.outageService.displayOutageInfo()) {
      this.isLoading = false;
      this.router.navigate(['/outage']);
    } else {
      try {
        const nextUrl = await this.authenticationService.login();
        const userProfile = await this.userService.loadUserProfile();
        const location = await this.locationService.loadStaticLocationLists();
        const team = await this.loadTeamListService.loadStaticTeamLists();
        this.getBackendVersionInfo();
        this.showOutageBanner = this.outageService.displayOutageBanner();
        const nextRoute = decodeURIComponent(
          userProfile.requiredToSignAgreement
            ? 'electronic-agreement'
            : nextUrl || 'responder-access'
        );
        await this.router.navigate([nextRoute]);
      } catch (error) {
        this.alertService.clearAlert();
        if (error.status === 403) {
          this.alertService.setAlert('danger', globalConst.accessError);
        } else {
          this.alertService.setAlert('danger', globalConst.systemError);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  public closeOutageBanner($event: boolean): void {
    this.showOutageBanner = $event;
  }

  private getBackendVersionInfo(): void {
    this.configService.getVersionInfo().subscribe((version) => {
      this.version = version;
    });
  }
}
