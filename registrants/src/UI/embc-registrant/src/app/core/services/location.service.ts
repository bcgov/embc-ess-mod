import { Injectable } from '@angular/core';
import { CommunityType, CommunityCode, Code, Address } from '../api/models';
import { ConfigurationService } from '../api/services';
import { RegAddress } from '../model/address';
import { CacheService } from './cache.service';

export interface Country {
  code?: string;
  name?: string;
}

export interface StateProvince {
  code?: string;
  countryCode?: string;
  name?: string;
}

export interface Community {
  code?: string;
  countryCode?: string;
  districtName?: string;
  name?: string;
  stateProvinceCode?: string;
  type?: CommunityType;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private communityList: Community[];
  private stateProvinceList: StateProvince[];
  private countriesList: Country[];
  private regionalDistricts: string[];

  constructor(
    private configService: ConfigurationService,
    private cacheService: CacheService
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

  /**
   * Replace codes from Address object to full objects for AddressModel
   *
   * @param addressObject Address object as defined by the API
   * @returns AddressModel object usable by the UI
   */
  public getAddressRegFromAddress(addressObject: Address): RegAddress {
    const communities = this.getCommunityList();
    const countries = this.getCountriesList();
    const stateProvinces = this.getStateProvinceList();

    const addressCommunity = communities.find(
      (comm) => comm.code === addressObject.community
    );
    let addressCountry = countries.find(
      (coun) => coun.code === addressObject.country
    );
    let addressStateProvince = stateProvinces.find(
      (sp) => sp.code === addressObject.stateProvince
    );

    if (addressStateProvince === undefined) {
      addressStateProvince = stateProvinces.find((sp) => sp.code === 'BC');
    }

    if (addressCountry === undefined) {
      addressCountry = countries.find((ct) => ct.code === 'CAN');
    }

    return {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      community: addressCommunity,
      stateProvince: addressStateProvince,
      country: addressCountry,
      postalCode: addressObject.postalCode
    };
  }

  /**
   * Map an address from the wizard to an address usable by the API
   *
   * @param addressObject An Address as defined by the site's address forms
   * @returns Address object as defined by the API
   */
  public setAddressObjectForDTO(addressObject: RegAddress): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country.code,
      community:
        (addressObject.community as Community).code === undefined
          ? null
          : (addressObject.community as Community).code,
      city:
        (addressObject.community as Community).code === undefined &&
        typeof addressObject.community === 'string'
          ? addressObject.community
          : null,
      postalCode: addressObject.postalCode,
      stateProvince:
        addressObject.stateProvince === null ||
        addressObject.stateProvince === undefined
          ? null
          : addressObject.stateProvince?.code
    };

    return address;
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
    this.configService
      .configurationGetCommunities()
      .subscribe((communities: CommunityCode[]) => {
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
      });
    return this.communityList || [];
  }

  private getStateProvinces(): StateProvince[] {
    this.configService
      .configurationGetStateProvinces()
      .subscribe((stateProvinces: Code[]) => {
        this.setStateProvinceList(
          [...stateProvinces].map((sp) => ({
            code: sp.value,
            name: sp.description,
            countryCode: sp.parentCode.value
          }))
        );
      });
    return this.stateProvinceList || [];
  }

  private getCountries(): Country[] {
    this.configService
      .configurationGetCountries()
      .subscribe((countries: Code[]) => {
        this.setCountriesList(
          [...countries].map((c) => ({ code: c.value, name: c.description }))
        );
      });
    return this.countriesList || [];
  }
}
