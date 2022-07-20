import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { Address, Code, CommunityType } from '../api/models';
import { CommunityCode } from '../api/models/community-code';
import { ConfigurationService } from '../api/services';
import { AddressModel } from '../models/address.model';
import { CacheService } from './cache.service';
import * as globalConst from './global-constants';

export interface Country {
  code?: null | string;
  name?: null | string;
  isActive?: boolean;
}

export interface StateProvince {
  code?: null | string;
  countryCode?: null | string;
  name?: null | string;
  isActive?: boolean;
}

export interface Community {
  code?: null | string;
  countryCode?: null | string;
  districtName?: null | string;
  name?: null | string;
  stateProvinceCode?: null | string;
  type?: CommunityType;
  isActive?: boolean;
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

  public getActiveCommunityList(): Community[] {
    return this.getCommunityList().filter((c) => c.isActive);
  }

  public getStateProvinceList(): StateProvince[] {
    return this.stateProvinceList
      ? this.stateProvinceList
      : JSON.parse(this.cacheService.get('stateProvinceList'))
      ? JSON.parse(this.cacheService.get('stateProvinceList'))
      : this.getStateProvinces();
  }

  public getActiveStateProvinceList(): Community[] {
    return this.getStateProvinceList().filter((sp) => sp.isActive);
  }

  public getCountriesList(): Country[] {
    return this.countriesList
      ? this.countriesList
      : JSON.parse(this.cacheService.get('countriesList'))
      ? JSON.parse(this.cacheService.get('countriesList'))
      : this.getCountries();
  }

  public getActiveCountriesList(): Community[] {
    return this.getCountriesList().filter((c) => c.isActive);
  }

  public getRegionalDistricts(): string[] {
    return this.regionalDistricts
      ? this.regionalDistricts
      : JSON.parse(this.cacheService.get('regionalDistrictsList'));
  }

  /**
   * Replace codes from Address object to full objects for AddressModel
   *
   * @param addressObject Address object as defined by the API
   * @returns AddressModel object usable by the UI
   */
  public getAddressModelFromAddress(addressObject: Address): AddressModel {
    const communities = this.getCommunityList();
    const countries = this.getCountriesList();
    const stateProvinces = this.getStateProvinceList();

    const addressCommunity = communities.find(
      (comm) => comm.code === addressObject?.communityCode
    );
    const addressCountry = countries.find(
      (coun) => coun.code === addressObject?.countryCode
    );
    const addressStateProvince = stateProvinces.find(
      (sp) => sp.code === addressObject?.stateProvinceCode
    );

    return {
      community: addressCommunity,
      country: addressCountry,
      stateProvince: addressStateProvince,
      ...addressObject
    };
  }

  /**
   * Map an address from the wizard to an address usable by the API
   *
   * @param addressObject An Address as defined by the site's address forms
   * @returns Address object as defined by the API
   */
  public setAddressObjectForDTO(addressObject: AddressModel): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      countryCode: addressObject.country.code,
      communityCode:
        (addressObject.community as Community).code === undefined
          ? null
          : (addressObject.community as Community).code,
      city:
        (addressObject.community as Community).code === undefined &&
        typeof addressObject.community === 'string'
          ? addressObject.community
          : null,
      postalCode: addressObject.postalCode,
      stateProvinceCode:
        addressObject.stateProvince === null ||
        addressObject.stateProvince === undefined
          ? null
          : addressObject.stateProvince?.code
    };

    return address;
  }

  /**
   * Maps the community from code
   *
   * @param code community code
   * @returns community object
   */
  public mapCommunityFromCode(code: string): Community {
    if (code !== null && code !== undefined) {
      const communities = this.getCommunityList();
      return communities.find((comm) => comm.code === code);
    }
  }

  public loadStaticLocationLists(): Promise<void> {
    const community: Observable<Array<CommunityCode>> =
      this.configService.configurationGetCommunities();
    const province: Observable<Array<CommunityCode>> =
      this.configService.configurationGetStateProvinces();
    const country: Observable<Array<CommunityCode>> =
      this.configService.configurationGetCountries();

    const list$ = forkJoin([community, province, country]).pipe(
      map((results) => {
        this.setCountriesList(
          [...results[2]].map((c) => ({
            code: c.value,
            name: c.description,
            isActive: c.isActive
          }))
        );

        this.setCommunityList(
          [...results[0]].map((c) => ({
            code: c.value,
            name: c.description,
            districtName: c.districtName,
            stateProvinceCode: c.parentCode.value,
            countryCode: c.parentCode.parentCode.value,
            type: c.communityType,
            isActive: c.isActive
          }))
        );
        this.setRegionalDistricts(
          Array.from(
            new Set(
              results[0]
                .filter((comm) => comm.districtName)
                .map((comm) => comm.districtName)
            )
          )
        );

        this.setStateProvinceList(
          [...results[1]].map((sp) => ({
            code: sp.value,
            name: sp.description,
            countryCode: sp.parentCode.value,
            isActive: sp.isActive
          }))
        );
      })
    );
    return lastValueFrom(list$);
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
    this.configService.configurationGetCommunities().subscribe({
      next: (communities: CommunityCode[]) => {
        this.setCommunityList(
          [...communities].map((c) => ({
            code: c.value,
            name: c.description,
            districtName: c.districtName,
            stateProvinceCode: c.parentCode.value,
            countryCode: c.parentCode.parentCode.value,
            type: c.communityType,
            isActive: c.isActive
          }))
        );
        this.setRegionalDistricts(
          Array.from(
            new Set(
              communities
                .filter((comm) => comm.districtName)
                .map((comm) => comm.districtName)
            )
          )
        );
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return this.communityList || [];
  }

  private getStateProvinces(): StateProvince[] {
    this.configService.configurationGetStateProvinces().subscribe({
      next: (stateProvinces: Code[]) => {
        this.setStateProvinceList(
          [...stateProvinces].map((sp) => ({
            code: sp.value,
            name: sp.description,
            countryCode: sp.parentCode.value,
            isActive: sp.isActive
          }))
        );
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return this.stateProvinceList || [];
  }

  private getCountries(): Country[] {
    this.configService.configurationGetCountries().subscribe({
      next: (countries: Code[]) => {
        this.setCountriesList(
          [...countries].map((c) => ({
            code: c.value,
            name: c.description,
            isActive: c.isActive
          }))
        );
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return this.countriesList || [];
  }
}
