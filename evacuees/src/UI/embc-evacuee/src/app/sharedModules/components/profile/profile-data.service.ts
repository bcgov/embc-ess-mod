import { Injectable } from '@angular/core';
import { Address, Profile, PersonDetails, ContactDetails } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { RestrictionService } from '../restriction/restriction.service';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {

    private loginProfile: Profile;
    private profile: Profile;
    private profileId: string;
    private _personalDetails: PersonDetails;
    private _primaryAddressDetails: Address;
    private _mailingAddressDetails: Address;
    private _contactDetails: ContactDetails;
    private _secretWordPhrase: string;

    public get personalDetails(): PersonDetails {
        return this._personalDetails;
    }
    public set personalDetails(value: PersonDetails) {
        this._personalDetails = value;
    }

    public get primaryAddressDetails(): Address {
        return this._primaryAddressDetails;
    }
    public set primaryAddressDetails(value: Address) {
        this._primaryAddressDetails = value;
    }

    public get mailingAddressDetails(): Address {
        return this._mailingAddressDetails;
    }
    public set mailingAddressDetails(value: Address) {
        this._mailingAddressDetails = value;
    }

    public get contactDetails(): ContactDetails {
        return this._contactDetails;
    }
    public set contactDetails(value: ContactDetails) {
        this._contactDetails = value;
    }

    public get secretWordPhrase(): string {
        return this._secretWordPhrase;
    }
    public set secretWordPhrase(value: string) {
        this._secretWordPhrase = value;
    }

    constructor(private cacheService: CacheService, private restrictionService: RestrictionService) { }

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
            secretPhrase: this.secretWordPhrase
        };
    }

    private setAddressObject(addressObject): Address {
        const address: Address = {
            addressLine1: addressObject.addressLine1,
            addressLine2: addressObject.addressLine2,
            country: {
                code: addressObject.country.code,
                name: addressObject.country.name
            },
            jurisdiction: {
                code: addressObject.jurisdiction.code === undefined ?
                    null : addressObject.jurisdiction.code,
                name: addressObject.jurisdiction.name ===
                    undefined ? addressObject.jurisdiction : addressObject.jurisdiction.name
            },
            postalCode: addressObject.postalCode,
            stateProvince: {
                code: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.code,
                name: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.name
            }
        };

        return address;
    }

}
