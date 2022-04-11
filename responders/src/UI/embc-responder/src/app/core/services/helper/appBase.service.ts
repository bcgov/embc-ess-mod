import { Injectable } from '@angular/core';
import {
  AppBaseModel,
  EtransferContent,
  EtransferRequirementStatus,
  EtransferProperties
} from '../../models/appBase.model';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {
  public static etransferRequirementDefault?: EtransferRequirementStatus[] = [
    { statement: EtransferContent.bcServicesCard, status: false },
    { statement: EtransferContent.isNotMinor, status: false },
    { statement: EtransferContent.acceptTransfer, status: true },
    { statement: EtransferContent.window, status: true }
  ];
  private appModelVal: AppBaseModel;
  private etransferPropertiesVal: EtransferProperties;

  constructor(public cacheService: CacheService) {}

  public get appModel(): AppBaseModel {
    return this.appModelVal
      ? this.appModelVal
      : JSON.parse(this.cacheService.get('appCache'));
  }

  public set appModel(value: Partial<AppBaseModel>) {
    this.appModelVal = { ...this.appModel, ...value };
  }

  public get etransferProperties(): EtransferProperties {
    return this.etransferPropertiesVal
      ? this.etransferPropertiesVal
      : JSON.parse(this.cacheService.get('eTransferProps'));
  }
  public set etransferProperties(value: EtransferProperties) {
    this.etransferPropertiesVal = { ...this.etransferProperties, ...value };
  }

  clear() {
    this.appModelVal = undefined;
    this.cacheService.remove('appCache');
  }

  setCache() {
    this.cacheService.set('eTransferProps', this.etransferProperties);
    this.cacheService.set('appCache', this.appModel);
  }
}
