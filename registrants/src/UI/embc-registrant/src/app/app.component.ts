import { Component } from '@angular/core';
import { ApiConfiguration } from './core/api/api-configuration';
import { LocationService } from './core/services/location.service';
import { SecurityQuestionsService } from './core/services/security-questions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    apiConfig: ApiConfiguration,
    private locationService: LocationService,
    private securityQuestionsService: SecurityQuestionsService
  ) {
    apiConfig.rootUrl = '';
    this.loadStaticLists();
  }

  private loadStaticLists(): void {
    this.locationService.getCommunityList();
    this.locationService.getCountriesList();
    this.locationService.getRegionalDistricts();
    this.locationService.getStateProvinceList();
    this.securityQuestionsService.getSecurityQuestionList();
  }
}
