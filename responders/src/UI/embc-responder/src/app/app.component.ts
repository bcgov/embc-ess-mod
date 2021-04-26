import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfigService } from './core/services/config.service';
import { UserService } from './core/services/user.service';
import { AlertService } from './shared/components/alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private configService: ConfigService,
    private alertService: AlertService
  ) {
    this.configService.load().subscribe(
      (result) => result,
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          'The service is temporarily unavailable. Please try again later'
        );
      }
    );
  }

  public async ngOnInit(): Promise<void> {
    try {
      const nextUrl = await this.authenticationService.login();
      const userProfile = await this.userService.loadUserProfile();
      const nextRoute = decodeURIComponent(
        userProfile.requiredToSignAgreement
          ? 'electronic-agreement'
          : nextUrl || 'responder-access'
      );
      await this.router.navigate([nextRoute]);
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert(
        'danger',
        'The service is temporarily unavailable. Please try again later'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
