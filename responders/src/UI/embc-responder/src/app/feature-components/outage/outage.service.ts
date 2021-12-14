import { Injectable } from '@angular/core';
import { OutageInformation } from 'src/app/core/api/models/outage-information';
import * as moment from 'moment';
import { OutageDialogComponent } from 'src/app/shared/outage-components/outage-dialog/outage-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class OutageService {
  // outageInfo: BehaviorSubject<OutageInformation> =
  //   new BehaviorSubject<OutageInformation>(null);
  // public outageInfo$: Observable<OutageInformation> =
  //   this.outageInfo.asObservable();

  private outageInfoVal: OutageInformation;

  constructor(private dialog: MatDialog) {}

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

  public openOutageDialog(): void {
    this.dialog.open(OutageDialogComponent, {
      data: { message: this.outageInfo, time: 5 },
      maxHeight: '100%',
      width: '556px',
      maxWidth: '100%'
    });
  }
}
