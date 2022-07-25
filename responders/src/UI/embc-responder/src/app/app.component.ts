import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { LoadEvacueeListService } from './core/services/load-evacuee-list.service';
import { SupplierService } from './core/services/suppliers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public show = true;
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
    private loadEvacueeListService: LoadEvacueeListService,
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
      this.outageService.outageInfo = configuration.outageInfo;
      this.outageService.setOutageInformation(configuration.outageInfo);
      this.timeOutService.timeOutInfo = configuration.timeoutInfo;
    } catch (error) {
      this.isLoading = false;
      this.alertService.clearAlert();
      this.router.navigate(['/outage'], { state: { type: 'unplanned' } });
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

        //loads cache
        //communities, provinces, countries
        const location = await this.locationService.loadStaticLocationLists();

        //enum lists
        const evacuee =
          await this.loadEvacueeListService.loadStaticEvacueeLists();

        //team member roles and labels
        const team = await this.loadTeamListService.loadStaticTeamLists();

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
          this.router.navigate(['/access-denied']);
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
}
