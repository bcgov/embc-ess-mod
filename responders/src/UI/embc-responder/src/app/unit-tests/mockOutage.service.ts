import { Injectable } from '@angular/core';
import { OutageInformation } from '../core/api/models';
import { OutageService } from '../feature-components/outage/outage.service';

@Injectable({
  providedIn: 'root'
})
export class MockOutageService extends OutageService {
  public outageInformation: OutageInformation;
  public getOutageInformation(): OutageInformation {
    return this.outageInformation;
  }

  public displayOutageInfoInit(): boolean {
    return this.outageInformation !== null;
  }
}
