import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { EnvironmentInformation } from '../../models/environment-information.model';
import { CacheService } from '../../services/cache.service';
import * as globalConst from '../../services/global-constants';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentBannerService {
  public environmentBanner: EnvironmentInformation;
  private configurationGetEnvironmentInfoPath = '/env/info.json';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private alertService: AlertService
  ) {}

  public loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    return new Promise<EnvironmentInformation>((resolve, reject) => {
      let environment: EnvironmentInformation = {};
      this.getEnvironment().subscribe({
        next: (env) => {
          environment = env;
          this.setEnvironmentBanner(env);
          resolve(environment);
        },
        error: (error) => {
          if (error.status === 400 || error.status === 404) {
            this.environmentBanner = null;
            resolve(environment);
          } else {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.systemError);
            reject(error);
          }
        }
      });
    });
  }

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner
      ? this.environmentBanner
      : JSON.parse(this.cacheService.get('environment'))
      ? JSON.parse(this.cacheService.get('environment'))
      : this.getEnvironmentInfo();
  }

  public setEnvironmentBanner(environmentBanner: EnvironmentInformation): void {
    this.cacheService.set('environment', environmentBanner);
    this.environmentBanner = environmentBanner;
  }

  private getEnvironment(): Observable<EnvironmentInformation> {
    const envUrl = this.configurationGetEnvironmentInfoPath;
    return this.http.get(envUrl);
  }

  private getEnvironmentInfo(): EnvironmentInformation {
    let environment: EnvironmentInformation = {};
    this.getEnvironment().subscribe({
      next: (env) => {
        environment = env;
        this.setEnvironmentBanner(env);
      },
      error: (error) => {
        if (error.status === 400 || error.status === 404) {
          this.environmentBanner = null;
        } else {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.systemError);
        }
      }
    });
    return environment;
  }
}
