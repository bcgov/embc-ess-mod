import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerConfig } from '../model/server-config';
import { ConfigService } from '../services/config.service';
import { SupplierHttpService } from '../services/supplierHttp.service';

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivate {
  public configResult: ServerConfig = new ServerConfig();

  constructor(
    private router: Router,
    private configService: ConfigService,
    private supplierHttp: SupplierHttpService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // This is set in app.component.ts
    if (!this.configService.getServerConfig()) {
      this.configService.setServerConfig(this.supplierHttp.getServerConfig());
    }

    return this.configService.getServerConfig().pipe(
      map((config) => {
        // If code is up in PROD, prevent from loading whatever is behind this guard.
        this.configResult = config;

        if (this.configResult.environment === 'production') {
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
}
