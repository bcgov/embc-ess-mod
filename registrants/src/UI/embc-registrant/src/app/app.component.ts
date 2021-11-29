import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AlertService } from './core/services/alert.service';
import * as globalConst from './core/services/globalConstants';
import { BootstrapService } from './core/services/bootstrap.service';
import { LoginService } from './core/services/login.service';
import { ConfigService } from './core/services/config.service';
import { EnvironmentInformation } from './core/model/environment-information.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public environment: EnvironmentInformation;

  constructor(
    private alertService: AlertService,
    private bootstrapService: BootstrapService,
    private loginService: LoginService,
    private configService: ConfigService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.getEnvironmentInfo();
    try {
      await this.bootstrapService.init();
      await this.loginService.tryLogin();
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.systemError);
    } finally {
      this.isLoading = false;
    }
  }

  private getEnvironmentInfo(): void {
    this.configService.getEnvironmentInfo().subscribe((env) => {
      this.environment = env;
      console.log(this.environment);
    });
  }
}
