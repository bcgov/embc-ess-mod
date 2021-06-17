import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { Code, CommunityType } from '../api/models';
import { CommunityCode } from '../api/models/community-code';
import { ConfigurationService } from '../api/services';
import { CacheService } from './cache.service';

export interface Country {
  code?: null | string;
  name?: null | string;
}

export interface StateProvince {
  code?: null | string;
  countryCode?: null | string;
  name?: null | string;
}

export interface Community {
  code?: null | string;
  countryCode?: null | string;
  districtName?: null | string;
  name?: null | string;
  stateProvinceCode?: null | string;
  type?: CommunityType;
}

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private communityList: Community[];
  private stateProvinceList: StateProvince[];
  private countriesList: Country[];
  private regionalDistricts: string[];

  constructor(
    private configService: ConfigurationService,
    private cacheService: CacheService,
    private alertService: AlertService
  ) {}

  public getCommunityList(): Community[] {
    return this.communityList
      ? this.communityList
      : JSON.parse(this.cacheService.get('communityList'))
      ? JSON.parse(this.cacheService.get('communityList'))
      : this.getCommunities();
  }

  public getStateProvinceList(): StateProvince[] {
    return this.stateProvinceList
      ? this.stateProvinceList
      : JSON.parse(this.cacheService.get('stateProvinceList'))
      ? JSON.parse(this.cacheService.get('stateProvinceList'))
      : this.getStateProvinces();
  }

  public getCountriesList(): Country[] {
    return this.countriesList
      ? this.countriesList
      : JSON.parse(this.cacheService.get('countriesList'))
      ? JSON.parse(this.cacheService.get('countriesList'))
      : this.getCountries();
  }

  public getRegionalDistricts(): string[] {
    return this.regionalDistricts
      ? this.regionalDistricts
      : JSON.parse(this.cacheService.get('regionalDistrictsList'));
  }

  private setCommunityList(communityList: Community[]): void {
    this.communityList = communityList;
    this.cacheService.set('communityList', communityList);
  }

  private setStateProvinceList(stateProvinceList: StateProvince[]): void {
    this.stateProvinceList = stateProvinceList;
    this.cacheService.set('stateProvinceList', stateProvinceList);
  }

  private setRegionalDistricts(regionalDistricts: string[]): void {
    this.regionalDistricts = regionalDistricts;
    this.cacheService.set('regionalDistrictsList', regionalDistricts);
  }

  private setCountriesList(countriesList: Country[]): void {
    this.countriesList = countriesList;
    this.cacheService.set('countriesList', countriesList);
  }

  private getCommunities(): Community[] {
    this.configService.configurationGetCommunities().subscribe(
      (communities: CommunityCode[]) => {
        this.setCommunityList(
          [...communities].map((c) => ({
            code: c.value,
            name: c.description,
            districtName: c.districtName,
            stateProvinceCode: c.parentCode.value,
            countryCode: c.parentCode.parentCode.value,
            type: c.communityType
          }))
        );
        this.setRegionalDistricts(communities.map((comm) => comm.districtName));
      },
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          'The service is temporarily unavailable. Please try again later'
        );
      }
    );
    return this.communityList || [];
  }

  private getStateProvinces(): StateProvince[] {
    this.configService.configurationGetStateProvinces().subscribe(
      (stateProvinces: Code[]) => {
        this.setStateProvinceList(
          [...stateProvinces].map((sp) => ({
            code: sp.value,
            name: sp.description,
            countryCode: sp.parentCode.value
          }))
        );
      },
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          'The service is temporarily unavailable. Please try again later'
        );
      }
    );
    return this.stateProvinceList || [];
  }

  private getCountries(): Country[] {
    this.configService.configurationGetCountries().subscribe(
      (countries: Code[]) => {
        this.setCountriesList(
          [...countries].map((c) => ({ code: c.value, name: c.description }))
        );
      },
      (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert(
          'danger',
          'The service is temporarily unavailable. Please try again later'
        );
      }
    );
    return this.countriesList || [];
  }
}
