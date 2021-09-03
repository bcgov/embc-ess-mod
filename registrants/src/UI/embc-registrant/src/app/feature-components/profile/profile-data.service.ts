import { Injectable } from '@angular/core';
import {
  Address,
  Profile,
  PersonDetails,
  ContactDetails,
  SecurityQuestion
} from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {
  private loginProfile: Profile;
  private profile: Profile;
  private profileId: string;
  private personalDetail: PersonDetails;
  private primaryAddressDetail: Address;
  private mailingAddressDetail: Address;
  private contactDetail: ContactDetails;
  private securityQuestionsVal: Array<SecurityQuestion> =
    new Array<SecurityQuestion>();

  public get personalDetails(): PersonDetails {
    return this.personalDetail;
  }
  public set personalDetails(value: PersonDetails) {
    this.personalDetail = value;
  }

  public get primaryAddressDetails(): Address {
    return this.primaryAddressDetail;
  }
  public set primaryAddressDetails(value: Address) {
    this.primaryAddressDetail = value;
  }

  public get mailingAddressDetails(): Address {
    return this.mailingAddressDetail;
  }
  public set mailingAddressDetails(value: Address) {
    this.mailingAddressDetail = value;
  }

  public get contactDetails(): ContactDetails {
    return this.contactDetail;
  }
  public set contactDetails(value: ContactDetails) {
    this.contactDetail = value;
  }

  public get securityQuestions(): Array<SecurityQuestion> {
    return this.securityQuestionsVal;
  }
  public set securityQuestions(value: Array<SecurityQuestion>) {
    this.securityQuestionsVal = value;
  }

  constructor(
    private cacheService: CacheService,
    private restrictionService: RestrictionService
  ) {}

  public getProfile(): Profile {
    if (this.profile === null || undefined) {
      this.profile = JSON.parse(this.cacheService.get('profile'));
    }
    return this.profile;
  }

  public setProfile(profile: Profile): void {
    this.profile = profile;
    this.cacheService.set('profile', profile);
  }

  public getLoginProfile(): Profile {
    if (this.loginProfile === null || undefined) {
      this.loginProfile = JSON.parse(this.cacheService.get('loginProfile'));
    }
    return this.loginProfile;
  }
  public setLoginProfile(loginProfile: Profile): void {
    this.loginProfile = loginProfile;
    this.cacheService.set('loginProfile', loginProfile);
  }

  public setProfileId(profileId: string): void {
    this.profileId = profileId;
  }

  public getProfileId(): string {
    return this.profileId;
  }

  public createProfileDTO(): Profile {
    return {
      contactDetails: this.contactDetails,
      mailingAddress: this.setAddressObject(this.mailingAddressDetails),
      personalDetails: this.personalDetails,
      primaryAddress: this.setAddressObject(this.primaryAddressDetails),
      restrictedAccess: this.restrictionService.restrictedAccess,
      securityQuestions: this.securityQuestions
    };
  }

  public setAddressObject(addressObject): Address {
    console.log(addressObject);
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country.code,
      community:
        addressObject.community.code === undefined
          ? null
          : addressObject.community.code,
      postalCode: addressObject.postalCode,
      stateProvince:
        addressObject.stateProvince === null
          ? addressObject.stateProvince
          : addressObject.stateProvince.code
    };

    return address;
  }
}
