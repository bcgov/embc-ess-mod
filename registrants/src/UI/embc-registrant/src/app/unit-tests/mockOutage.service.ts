import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OutageInformation } from '../core/api/models';
import { CacheService } from '../core/services/cache.service';
import { OutageService } from '../feature-components/outage/outage.service';
import { MockAlertService } from './mockAlert.service';
import { MockConfigService } from './mockConfig.service';
import { MockLoginService } from './mockLogin.service';

@Injectable({
  providedIn: 'root'
})
export class MockOutageService extends OutageService {
  public outageInfoValue: OutageInformation;
  public outageState: boolean;

  public get outageInfo(): OutageInformation {
    return this.outageInfoValue;
  }
  public set outageInfo(value: OutageInformation) {
    this.outageInfoValue = value;
  }

  constructor(
    public dialog: MatDialog,
    public configService: MockConfigService,
    public alertService: MockAlertService,
    public router: Router,
    public loginService: MockLoginService,
    public cacheService: CacheService,
    zone: NgZone
  ) {
    super(
      dialog,
      configService,
      alertService,
      router,
      loginService,
      cacheService,
      zone
    );
  }

  public displayOutageInfoInit(): boolean {
    return this.outageState;
  }
}
