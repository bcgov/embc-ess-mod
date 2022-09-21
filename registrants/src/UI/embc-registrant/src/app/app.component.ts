import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AlertService } from './core/services/alert.service';
import * as globalConst from './core/services/globalConstants';
import { BootstrapService } from './core/services/bootstrap.service';
import { LoginService } from './core/services/login.service';
import { ConfigService } from './core/services/config.service';
import { EnvironmentInformation } from './core/model/environment-information.model';
import { OutageService } from './feature-components/outage/outage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public environment: EnvironmentInformation = {};

  constructor(
    public outageService: OutageService,
    private alertService: AlertService,
    private bootstrapService: BootstrapService,
    private loginService: LoginService,
    private configService: ConfigService
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.environment = await this.configService.loadEnvironmentBanner();
      await this.bootstrapService.init();
      await this.loginService.tryLogin();
    } catch (error) {
      this.isLoading = false;
      if (error.status === 400 || error.status === 404) {
        this.environment = null;
      } else {
        this.isLoading = false;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    } finally {
      this.isLoading = false;
    }

    this.outageService.outagePolling();
    this.outageService.startOutageInterval();
  }

  public closeOutageBanner($event: boolean): void {
    this.outageService.setShowOutageBanner($event);
    this.outageService.closeBannerbyUser = !$event;
  }
}
