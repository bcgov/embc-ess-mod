import { Injectable } from '@angular/core';
import { Configuration } from '../core/api/models';
import { ConfigService } from '../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class MockConfigService extends ConfigService {
  public config: Configuration;

  public async loadConfig(): Promise<Configuration> {
    return Promise.resolve(this.config);
  }
}
