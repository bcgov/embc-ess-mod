import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { SupplierHttpService } from '../services/supplierHttp.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServerConfig } from '../model/server-config';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivate {
  public configResult: ServerConfig = new ServerConfig();

  constructor(
    private router: Router,
    private configService: ConfigService,
    private supplierHttp: SupplierHttpService
  ) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Always allow error page to load
    if (state.url === '/error') {
      return true;
    }

    // This is set in app.component.ts
    if (!this.configService.getServerConfig()) {
      this.configService.setServerConfig(this.supplierHttp.getServerConfig());
    }

    return this.configService.getServerConfig().pipe(
      map((config) => {
        // Set global maint/notice vars and redirect if site down
        this.configResult = config;

        if (
          this.configResult.siteDown &&
          this.configResult.maintMsg !== '' &&
          state.url !== '/maintenance'
        ) {
          this.router.navigate(['/maintenance']);
          return false;
        } else if (
          this.configResult.siteDown &&
          this.configResult.maintMsg === '' &&
          state.url !== '/error'
        ) {
          this.router.navigate(['/error']);
          return false;
        } else if (
          !this.configResult.siteDown &&
          state.url === '/maintenance'
        ) {
          this.router.navigate(['/']);
          return false;
        }

        return true;
      }),
      catchError(() => this.router.navigate(['/error']))
    );
  }
}
