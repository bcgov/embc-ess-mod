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

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private configService: ConfigService,
    private alertService: AlertService,
    private locationService: LocationsService,
    private loadTeamListService: LoadTeamListService
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.show = !e.url.startsWith('/ess-wizard', 0);
      }
    });

    this.configService.load().subscribe(
      (result) => result,
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    );
  }

  public async ngOnInit(): Promise<void> {
    this.environment = this.configService.getEnvironmentBanner();
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

  private getBackendVersionInfo(): void {
    this.configService.getVersionInfo().subscribe((version) => {
      this.version = version;
    });
  }
}
