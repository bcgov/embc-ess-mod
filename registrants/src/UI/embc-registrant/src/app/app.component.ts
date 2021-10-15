import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';
import { AlertService } from './core/services/alert.service';
import { LocationService } from './core/services/location.service';
import { SecurityQuestionsService } from './core/services/security-questions.service';
import * as globalConst from './core/services/globalConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';

  constructor(
    apiConfig: ApiConfiguration,
    private locationService: LocationService,
    private securityQuestionsService: SecurityQuestionsService,
    private alertService: AlertService
  ) {
    apiConfig.rootUrl = '';
  }

  public async ngOnInit() {
    try {
      const location = await this.locationService.loadStaticLocationLists();
      const questions =
        await this.securityQuestionsService.loadSecurityQuesList();
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.systemError);
    } finally {
      this.isLoading = false;
    }
  }
}
