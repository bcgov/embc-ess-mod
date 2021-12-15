import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EnvironmentInformation } from '../../models/environment-information.model';
import { CacheService } from '../../services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentBannerService {
  public environmentBanner: EnvironmentInformation;
  private configurationGetEnvironmentInfoPath = '/env/info.json';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner
      ? this.environmentBanner
      : JSON.parse(this.cacheService.get('environment'))
      ? JSON.parse(this.cacheService.get('environment'))
      : this.getEnvironmentInfo();
  }

  public setEnvironmentBanner(environmentBanner: EnvironmentInformation): void {
    this.cacheService.set('environment', environmentBanner);
  }

  private async getEnvironmentInfo(): Promise<EnvironmentInformation> {
    return this.getEnvironment()
      .pipe(
        tap((env) => {
          this.environmentBanner = env;
        })
      )
      .toPromise();
  }

  private getEnvironment(): Observable<EnvironmentInformation> {
    const envUrl = this.configurationGetEnvironmentInfoPath;
    return this.http.get(envUrl);
  }
}
