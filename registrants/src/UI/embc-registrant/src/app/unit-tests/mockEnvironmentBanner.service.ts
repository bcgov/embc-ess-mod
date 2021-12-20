import { Injectable } from '@angular/core';
import { EnvironmentInformation } from '../core/model/environment-information.model';
import { ConfigService } from '../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MockEnvironmentBannerService extends ConfigService {
  public environmentBanner: EnvironmentInformation;

  public loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    return Promise.resolve(this.environmentBanner);
  }

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner;
  }
}
