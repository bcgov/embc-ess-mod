import { Injectable } from '@angular/core';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EssfileDashboardService {
  private essFileVal: EvacuationFileModel;

  constructor(private cacheService: CacheService) {}

  get essFile(): EvacuationFileModel {
    return this.essFileVal === null || this.essFileVal === undefined
      ? JSON.parse(this.cacheService.get('essFile'))
      : this.essFileVal;
  }

  set essFile(essFileVal: EvacuationFileModel) {
    this.essFileVal = essFileVal;
    this.cacheService.set('essFile', essFileVal);
  }
}
