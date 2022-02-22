/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ConfigurationService } from './services/configuration.service';
import { ProfileService } from './services/profile.service';
import { RegistrationsService } from './services/registrations.service';
import { ReportsService } from './services/reports.service';
import { SuppliersService } from './services/suppliers.service';
import { TasksService } from './services/tasks.service';
import { TeamCommunitiesAssignmentsService } from './services/team-communities-assignments.service';
import { TeamsService } from './services/teams.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ConfigurationService,
    ProfileService,
    RegistrationsService,
    ReportsService,
    SuppliersService,
    TasksService,
    TeamCommunitiesAssignmentsService,
    TeamsService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
