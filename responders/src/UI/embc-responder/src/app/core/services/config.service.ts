import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration } from '../api/models';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config?: Configuration = null;

  constructor(private httpClient: HttpClient) { }

  public load(): Promise<Configuration> {
    if (this.config != null) {
      return Promise.resolve(this.config);
    }
    return this.httpClient
      .get<Configuration>('/api/configuration')
      .pipe(tap(c => this.config = { ...c }))
      .toPromise();
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    console.log(this.config);
    return await this.load().then(c => ({
      issuer: c.oidc.issuer,
      clientId: c.oidc.clientId,
      redirectUri: window.location.origin + '/',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      showDebugInformation: !environment.production,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      customQueryParams: { kc_idp_hint: 'bceid' },
    }));
  }

  public isConfigured(): boolean {
    return this.config === null;
  }
}
