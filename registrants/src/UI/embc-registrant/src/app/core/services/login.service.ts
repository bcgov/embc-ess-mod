import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { lastValueFrom, Subject } from 'rxjs';
import { Profile } from '../api/models';
import { ProfileService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isLoggedIn$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private oauthService: OAuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  public async login(targetUrl: string = undefined): Promise<boolean> {
    return await this.oauthService.tryLoginImplicitFlow().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        if (this.verifiedRegistrationFlow(targetUrl) || this.nonVerifiedRegistrationFlow(targetUrl)) {
          this.oauthService.initImplicitFlow(targetUrl);
          this.isLoggedIn$.next(false);
          return Promise.resolve(false);
        } else {
          this.router.navigateByUrl('/');
          this.isLoggedIn$.next(false);
          return Promise.resolve(false);
        }
      }
      this.isLoggedIn$.next(true);
      return Promise.resolve(true);
    });
  }

  public async logout(): Promise<void> {
    await this.oauthService.revokeTokenAndLogout();
    this.isLoggedIn$.next(false);
  }

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidIdToken();
  }

  public getUserSession(): string {
    return btoa(this.oauthService.getAccessToken());
  }

  public async getUserProfile(): Promise<Profile> {
    const profile = await lastValueFrom(this.profileService.profileGetProfile());
    return profile;
  }

  private verifiedRegistrationFlow(targetUrl: string): boolean {
    if (!targetUrl) {
      return false;
    }

    const url = new URL(targetUrl, window.location.origin);

    return (
      url.pathname === '/verified-registration' &&
      url.searchParams.has('inviteId') &&
      url.searchParams.get('inviteId')?.trim() !== ''
    );
  }

  private nonVerifiedRegistrationFlow(targetUrl: string): boolean {
    if (!targetUrl) {
      return false;
    }

    const url = new URL(targetUrl, window.location.origin);

    return url.pathname === '/verified-registration' && !url.searchParams.has('inviteId');
  }

  public async tryLogin(): Promise<void> {
    await this.oauthService.tryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.oauthService.setupAutomaticSilentRefresh();
        this.isLoggedIn$.next(true);
        const targetUrl = this.oauthService.state;
        if (targetUrl) {
          return this.router.navigateByUrl(decodeURIComponent(targetUrl));
        }
      }
    });
  }
}
