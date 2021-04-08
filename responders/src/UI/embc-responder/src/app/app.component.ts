import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { LoadLocationsService } from './core/services/load-locations.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isLoading = true;
  public color = '#169BD5';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
  }

  public async ngOnInit(): Promise<void> {
    try {
      const nextUrl = await this.authenticationService.login();
      const userProfile = await this.userService.loadUserProfile();
      const nextRoute = decodeURIComponent(userProfile.requiredToSignAgreement
        ? 'electronic-agreement'
        : nextUrl || 'responder-access');
      await this.router.navigate([nextRoute]);
    } catch (e) {
      // if (e as HttpErrorResponse && e.status === 403) {
      //   await this.router.navigate(['access-denied']);
      // }
      // throw e;
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

}
