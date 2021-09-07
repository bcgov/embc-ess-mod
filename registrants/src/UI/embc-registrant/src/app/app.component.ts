import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiConfiguration } from './core/api/api-configuration';
import { AlertService } from './core/services/alert.service';
import { LocationService } from './core/services/location.service';
import { SecurityQuestionsService } from './core/services/security-questions.service';

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
    private router: Router,
    private alertService: AlertService
  ) {
    apiConfig.rootUrl = '';
  }

  public async ngOnInit() {
    try {
      this.loadStaticLists();
    } catch (error) {
      console.log(error);
      this.alertService.clearAlert();
      this.alertService.setAlert(
        'danger',
        'The service is temporarily unavailable. Please try again later'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private loadStaticLists(): void {
    this.locationService.getCommunityList();
    this.locationService.getCountriesList();
    this.locationService.getRegionalDistricts();
    this.locationService.getStateProvinceList();
    this.securityQuestionsService.getSecurityQuestionList();
  }
}
