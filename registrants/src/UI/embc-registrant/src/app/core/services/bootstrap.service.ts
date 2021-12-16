import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
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
    private timeoutService: TimeoutService
  ) {}

  public async init(): Promise<void> {
    //load server config
    const config = await this.configService.loadConfig();
    this.timeoutService.timeOutInfo = config.timeoutInfo;

    //load metadata lists
    await this.locationService.loadStaticLocationLists();
    await this.securityQuestionsService.loadSecurityQuesList();

    //configure and load oauth module configuration
    this.oauthService.configure(this.configService.getOAuthConfig());
    await this.oauthService.loadDiscoveryDocument();
  }
}
