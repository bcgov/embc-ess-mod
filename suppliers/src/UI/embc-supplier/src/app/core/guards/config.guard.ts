import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SupplierHttpService } from '../services/supplierHttp.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerConfig } from '../model/server-config';
import { SupplierService } from '../services/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivate {
  public configResult: ServerConfig = new ServerConfig();

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private supplierHttp: SupplierHttpService
  ) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // This is set in app.component.ts
    if (!this.supplierService.getServerConfig())
      this.supplierService.setServerConfig(this.supplierHttp.getServerConfig());

    return this.supplierService.getServerConfig().pipe(
      map(config => {
        // Set global maint/notice vars and redirect if site down
        this.configResult = config;

        if (this.configResult.siteDown && state.url !== '/maintenance') {
          this.router.navigate(['/maintenance']);
          return false;
        }
        else if (!this.configResult.siteDown && state.url === '/maintenance') {
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
}