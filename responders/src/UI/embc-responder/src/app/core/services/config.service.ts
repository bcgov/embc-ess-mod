import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Configuration } from '../api/models';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config?: Configuration;

  constructor(private httpClient: HttpClient) { }

  public get(): Observable<Configuration> {
    if (this.config != null) {
      return from([this.config]);
    }
    return this.httpClient.get<Configuration>('/api/configuration').pipe(tap(c => this.config = { ...c }));
  }

  public getAuthConfig(): Observable<AuthConfig> {
    return this.get().pipe(map(c => ({
      issuer: c.oidc.issuer,
      clientId: c.oidc.clientId,
      redirectUri: window.location.origin + '/',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      showDebugInformation: !environment.production,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      customQueryParams: { kc_idp_hint: 'bceid' },
    })));
  }
}
