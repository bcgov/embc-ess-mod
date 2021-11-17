import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AlertService } from './alert.service';
import { EmailInviteService } from './emailInvite.service';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private emailService: EmailInviteService,
    private router: Router,
    private alertService: AlertService
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const queryParams = route.queryParamMap;
    const inviteId: string = queryParams.get('inviteId') ?? undefined;
    if (inviteId !== undefined) {
      try {
        const loginState: boolean = await this.loginService.login(state.url);
        const resolvedState = await this.emailService.validateInvite(
          loginState,
          inviteId
        );
        if (resolvedState) {
          return await this.router.navigate(['/verified-registration']);
        }
      } catch (error) {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', error.error.title);
      }
    } else {
      return await this.loginService.login(state.url);
    }
  }
}
