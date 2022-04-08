import { Injectable } from '@angular/core';
import {
  AppBaseModel,
  EtransferContent,
  EtransferRequirementStatus,
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

  constructor(public cacheService: CacheService) {}

  public get appModel(): AppBaseModel {
    return this.appModelVal
      ? this.appModelVal
      : JSON.parse(this.cacheService.get('appCache'));
  }

  public set appModel(value: Partial<AppBaseModel>) {
    this.appModelVal = { ...this.appModel, ...value };
  }

  clear() {
    this.appModelVal = undefined;
    this.cacheService.remove('appCache');
  }

  setCache() {
    console.log(this.appModel);
    this.cacheService.set('appCache', this.appModel);
  }
}
