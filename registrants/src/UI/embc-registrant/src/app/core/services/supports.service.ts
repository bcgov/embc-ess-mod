import { Injectable } from '@angular/core';
import { Code } from '../api/models';
import { ConfigurationService } from '../api/services';
import { AlertService } from './alert.service';
import * as globalConst from './globalConstants';

@Injectable({
  providedIn: 'root'
})
export class SupportsService {
  private supportStatusVal: Code[] = [];
  private supportMethodVal: Code[] = [];

  constructor(
    private configService: ConfigurationService,
    private alertService: AlertService
  ) {}

  get supportStatus() {
    return this.supportStatusVal;
  }

  set supportStatus(supportStatusVal: Code[]) {
    this.supportStatusVal = supportStatusVal;
  }

  get supportMethods() {
    return this.supportMethodVal;
  }

  set supportMethods(supportMethodVal: Code[]) {
    this.supportMethodVal = supportMethodVal;
  }

  public getSupportStatusList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportStatus' })
      .subscribe({
        next: (supStatus: Code[]) => {
          this.supportStatus = supStatus.filter(
            (status) => status.description !== null
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportStatusListError
          );
        }
      });
  }
}
