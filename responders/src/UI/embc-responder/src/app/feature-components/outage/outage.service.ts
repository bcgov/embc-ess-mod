import { Injectable } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutageService {
  outageInfo: BehaviorSubject<OutageInformation> = new BehaviorSubject<OutageInformation>(
    null
  );
  public outageInfo$: Observable<OutageInformation> = this.outageInfo.asObservable();

  public getOutageInfo(): Observable<OutageInformation> {
    return this.outageInfo$;
  }

  public setOutageInfo(outage: OutageInformation): void {
    this.outageInfo.next(outage);
  }

  public displayOutageInfo(): boolean {
    this.outageInfo$.subscribe((outage) => {
      if (outage !== null) {
        const now = new Date();
        const outageStart = new Date(outage.outageStartDate);
        const outageEnd = new Date(outage.outageEndDate);

        console.log(outageStart);
        console.log(outageEnd);

        if (
          moment(outageStart).isBefore(now) &&
          moment(outageEnd).isAfter(now)
        ) {
          return true;
        }
      }
      return false;
    });
    return false;
  }

  public displayOutageBanner(): boolean {
    if (this.outageInfo.getValue() !== null) {
      const now = new Date();
      const outageStart = new Date(this.outageInfo.getValue().outageStartDate);

      if (moment(outageStart).isAfter(now)) {
        return true;
      }
    }
    return false;
  }
}
