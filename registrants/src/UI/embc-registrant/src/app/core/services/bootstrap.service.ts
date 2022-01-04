import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { AlertService } from './alert.service';
import { ConfigService } from './config.service';
import { LocationService } from './location.service';
import { SecurityQuestionsService } from './security-questions.service';
import { TimeoutService } from './timeout.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  constructor(
    private configService: ConfigService,
    private oauthService: OAuthService,
    private locationService: LocationService,
    private securityQuestionsService: SecurityQuestionsService,
    private timeoutService: TimeoutService,
    private outageService: OutageService,
    private router: Router
  ) {}

  public async init(): Promise<void> {
    try {
      //load server config
      const config = await this.configService.loadConfig();
      this.timeoutService.timeOutInfo = config.timeoutInfo;
      this.outageService.outageInfo = config.outageInfo;
      console.log(this.outageService.outageInfo);
    } catch (error) {
      this.router.navigate(['/outage']);
    }

    if (this.outageService.displayOutageInfoInit()) {
      this.router.navigate(['/outage']);
    } else {
      try {
        //load metadata lists
        await this.locationService.loadStaticLocationLists();
        await this.securityQuestionsService.loadSecurityQuesList();

        //configure and load oauth module configuration
        this.oauthService.configure(this.configService.getOAuthConfig());
        await this.oauthService.loadDiscoveryDocument();
      } catch (error) {
        this.router.navigate(['/outage']);
      }
    }
  }
}
