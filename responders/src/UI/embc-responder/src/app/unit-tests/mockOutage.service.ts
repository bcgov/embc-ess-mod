import { Injectable } from '@angular/core';
import { OutageInformation } from '../core/api/models';
import { OutageService } from '../feature-components/outage/outage.service';

@Injectable({
  providedIn: 'root'
})
export class MockOutageService extends OutageService {
  public outageInfoValue: OutageInformation;

  public get outageInfo(): OutageInformation {
    return this.outageInfoValue;
  }
  public set outageInfo(value: OutageInformation) {
    this.outageInfoValue = value;
  }
}
