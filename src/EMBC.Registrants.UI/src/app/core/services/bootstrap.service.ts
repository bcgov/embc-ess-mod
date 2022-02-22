import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { AlertService } from './alert.service';
import { ConfigService } from './config.service';
import { LocationService } from './location.service';
import { SecurityQuestionsService } from './security-questions.service';
import { TimeoutService } from './timeout.service';
import * as globalConst from './globalConstants';

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
    private alertService: AlertService,
    private router: Router
  ) {}

  public async init(): Promise<void> {
    try {
      //load server config
      const config = await this.configService.loadConfig();
      console.log(config);
      this.timeoutService.timeOutInfo = config.timeoutInfo;
      this.outageService.outageInfo = config.outageInfo;
      this.outageService.setOutageInformation(config.outageInfo);
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.systemError);
    }

    if (this.outageService.displayOutageInfoInit()) {
      this.outageService.initOutageType();
    } else {
      try {
        //load metadata lists
        await this.locationService.loadStaticLocationLists();
        await this.securityQuestionsService.loadSecurityQuesList();

        //configure and load oauth module configuration
        this.oauthService.configure(this.configService.getOAuthConfig());
        await this.oauthService.loadDiscoveryDocument();
      } catch (error) {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    }
  }
}
