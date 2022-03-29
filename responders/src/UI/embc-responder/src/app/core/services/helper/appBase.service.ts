import { Injectable } from '@angular/core';
import { AppBaseModel, SelectedPathType } from '../../models/appBase.model';
import { EssTaskModel } from '../../models/ess-task.model';
import { CacheService } from '../cache.service';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {
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
