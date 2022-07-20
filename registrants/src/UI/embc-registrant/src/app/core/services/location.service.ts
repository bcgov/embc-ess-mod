import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunityType, CommunityCode, Code, Address } from '../api/models';
import { ConfigurationService } from '../api/services';
import { RegAddress } from '../model/address';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';
import * as globalConst from './globalConstants';

export interface Country {
  code?: string;
  name?: string;
  isActive?: boolean;
}

export interface StateProvince {
  code?: string;
  countryCode?: string;
  name?: string;
  isActive?: boolean;
}

export interface Community {
  code?: string;
  countryCode?: string;
  districtName?: string;
  name?: string;
  stateProvinceCode?: string;
  type?: CommunityType;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private communityList: Community[];
  private stateProvinceList: StateProvince[];
  private countriesList: Country[];
  private regionalDistricts: string[];
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];

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

  get supportCategory(): Code[] {
    return this.supportCategoryVal.length > 0
      ? this.supportCategoryVal
      : JSON.parse(this.cacheService.get('supportCategory'))
      ? JSON.parse(this.cacheService.get('supportCategory'))
      : this.getCategoryList();
  }

  set supportCategory(supportCategoryVal: Code[]) {
    this.supportCategoryVal = supportCategoryVal;
    this.cacheService.set('supportCategory', supportCategoryVal);
  }

  set supportSubCategory(supportSubCategoryVal: Code[]) {
    this.supportSubCategoryVal = supportSubCategoryVal;
    this.cacheService.set('supportSubCategory', supportSubCategoryVal);
  }

  get supportSubCategory() {
    return this.supportSubCategoryVal.length > 0
      ? this.supportSubCategoryVal
      : JSON.parse(this.cacheService.get('supportSubCategory'))
      ? JSON.parse(this.cacheService.get('supportSubCategory'))
      : this.getSubCategoryList();
  }

  public loadSupportCodes() {
    this.getCategoryList();
    this.getSubCategoryList();
  }

  public async loadStaticLocationLists(): Promise<void> {
    const community = this.configService.configurationGetCommunities();
    const province = this.configService.configurationGetStateProvinces();
    const country = this.configService.configurationGetCountries();

    return await lastValueFrom(
      forkJoin([community, province, country]).pipe(
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
            results[0].map((comm) => comm.districtName)
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
      )
    );
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

    const addressCommunity =
      communities.find((comm) => comm.code === addressObject.community) ??
      communities.find((comm) => comm.name === addressObject.community);

    const addressCountry =
      countries.find((coun) => coun.code === addressObject.country) ??
      countries.find((coun) => coun.code === 'CAN');

    const addressStateProvince =
      stateProvinces.find((sp) => sp.code === addressObject.stateProvince) ??
      stateProvinces.find((sp) => sp.code === 'BC');

    return {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      community: addressCommunity || addressObject.city || '',
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
        this.setRegionalDistricts(communities.map((comm) => comm.districtName));
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

  private getCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportCategory' })
      .subscribe({
        next: (categories: Code[]) => {
          this.supportCategory = categories.filter(
            (category) => category.description
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportCategoryListError
          );
        }
      });
  }

  private getSubCategoryList(): void {
    this.configService
      .configurationGetCodes({ forEnumType: 'SupportSubCategory' })
      .subscribe({
        next: (subCategories: Code[]) => {
          this.supportSubCategory = subCategories.filter(
            (subCategory) => subCategory.description
          );
        },
        error: (error) => {
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.supportCategoryListError
          );
        }
      });
  }
}
