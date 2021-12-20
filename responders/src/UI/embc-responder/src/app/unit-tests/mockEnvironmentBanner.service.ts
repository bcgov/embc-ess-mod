import { Injectable } from '@angular/core';
import { EnvironmentInformation } from 'src/app/core/models/environment-information.model';
import { EnvironmentBannerService } from '../core/layout/environment-banner/environment-banner.service';

@Injectable({
  providedIn: 'root'
})
export class MockEnvironmentBannerService extends EnvironmentBannerService {
  public environmentBanner: EnvironmentInformation;

  public loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    return Promise.resolve(this.environmentBanner);
  }

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner;
  }
}
