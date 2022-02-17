import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OutageInformation } from '../core/api/models';
import { AuthenticationService } from '../core/services/authentication.service';
import { CacheService } from '../core/services/cache.service';
import { OutageService } from '../feature-components/outage/outage.service';
import { MockAlertService } from './mockAlert.service';
import { MockConfigService } from './mockConfig.service';

@Injectable({
  providedIn: 'root'
})
export class MockOutageService extends OutageService {
  public outageInfoValue: null | OutageInformation;
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
    public authenticationService: AuthenticationService,
    public cacheService: CacheService
  ) {
    super(
      dialog,
      configService,
      alertService,
      router,
      authenticationService,
      cacheService
    );
  }

  public displayOutageInfoInit(): boolean {
    return this.outageState;
  }
}
