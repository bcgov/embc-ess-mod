import { Injectable } from '@angular/core';
import { AppBaseModel } from '../../models/appBase.model';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {
  private appModelVal: Partial<AppBaseModel>;

  constructor(public cacheService: CacheService) {}

  public get appModel(): AppBaseModel {
    return this.appModelVal
      ? this.appModelVal
      : JSON.parse(this.cacheService.get('appCache'));
  }
  public setAppModel(value: Partial<AppBaseModel>) {
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
