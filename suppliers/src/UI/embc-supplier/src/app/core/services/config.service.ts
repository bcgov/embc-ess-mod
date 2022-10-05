import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServerConfig } from '../model/server-config';
import { SupplierHttpService } from './supplierHttp.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private authConfig?: Configuration = null;
  private serverConfig: Observable<ServerConfig>;

  constructor(private supplierHttp: SupplierHttpService) {}

  public load(): Observable<Configuration> {
    if (this.authConfig != null) {
      return of(this.authConfig);
    }

    // This is set in app.component.ts
    if (!this.getServerConfig()) {
      this.setServerConfig(this.supplierHttp.getServerConfig());
    }

    return this.getServerConfig().pipe(
      tap((c: any) => {
        this.authConfig = { ...c };
      })
    );
  }

  public setServerConfig(serverConfig: Observable<ServerConfig>) {
    this.serverConfig = serverConfig;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    return await this.load()
      .pipe(
        map((c) => ({
          issuer: c.oidc.issuer,
          clientId: c.oidc.clientId,
          redirectUri: window.location.origin + '/auth',
          responseType: 'code',
          scope: 'openid profile email offline_access',
          showDebugInformation: !environment.production,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          customQueryParams: { kc_idp_hint: 'bceid' }
        }))
      )
      .toPromise();
  }

  public isConfigured(): boolean {
    return this.authConfig === null;
  }
}

export interface OidcConfiguration {
  clientId?: null | string;
  issuer?: null | string;
}

export interface Configuration {
  oidc?: null | OidcConfiguration;
}
