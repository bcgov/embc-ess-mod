import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AlertService } from './core/services/alert.service';
import * as globalConst from './core/services/globalConstants';
import { BootstrapService } from './core/services/bootstrap.service';
import { LoginService } from './core/services/login.service';
import { ConfigService } from './core/services/config.service';
import { EnvironmentInformation } from './core/model/environment-information.model';
import { OutageService } from './feature-components/outage/outage.service';
import { AppLoaderComponent } from './core/components/app-loader/app-loader.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './core/components/alert/alert.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { EnvironmentBannerComponent } from './core/layout/environment-banner/environment-banner.component';
import { OutageBannerComponent } from './sharedModules/outage-components/outage-banner/outage-banner.component';
import { NgStyle, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    OutageBannerComponent,
    EnvironmentBannerComponent,
    HeaderComponent,
    NgStyle,
    AlertComponent,
    RouterOutlet,
    FooterComponent,
    AppLoaderComponent,
    AsyncPipe
  ]
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
