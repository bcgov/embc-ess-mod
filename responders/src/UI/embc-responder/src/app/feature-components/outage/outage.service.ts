import { Injectable } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutageService {
  // outageInfo: BehaviorSubject<OutageInformation> =
  //   new BehaviorSubject<OutageInformation>(null);
  // public outageInfo$: Observable<OutageInformation> =
  //   this.outageInfo.asObservable();

  private outageInfoVal: OutageInformation;

  public get outageInfo(): OutageInformation {
    return this.outageInfoVal;
  }
  public set outageInfo(value: OutageInformation) {
    this.outageInfoVal = value;
  }

  public displayOutageInfo(): boolean {
    if (this.outageInfo !== null) {
      const now = new Date();
      const outageStart = new Date(this.outageInfoVal?.outageStartDate);
      const outageEnd = new Date(this.outageInfoVal?.outageEndDate);
      return (
        moment(outageStart).isBefore(now) && moment(outageEnd).isAfter(now)
      );
    }
    return false;
  }

  public displayOutageBanner(): boolean {
    if (this.outageInfo !== null) {
      const now = new Date();
      const outageStart = new Date(this.outageInfo.outageStartDate);
      return moment(outageStart).isAfter(now);
    }
    return false;
  }
}
