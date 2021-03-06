import { Injectable } from '@angular/core';
import { Community, Country, StateProvince } from '../api/models';
import { LocationsService } from '../api/services';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class LoadLocationsService {

    constructor(private locationsService: LocationsService, private cacheService: CacheService) { }

    private communityList: Community[];
    private stateProvinceList: StateProvince[];
    private countriesList: Country[];
    private regionalDistricts: string[];

    public getCommunityList(): Community[] {
        return this.communityList ? this.communityList :
            (JSON.parse(this.cacheService.get('communityList')) ?
                JSON.parse(this.cacheService.get('communityList')) : this.getCommunities());
    }

    private setCommunityList(communityList: Community[]): void {
        this.communityList = communityList;
        this.cacheService.set('communityList', communityList);
    }

    public getStateProvinceList(): StateProvince[] {
        return this.stateProvinceList ? this.stateProvinceList :
            (JSON.parse(this.cacheService.get('stateProvinceList')) ?
                JSON.parse(this.cacheService.get('stateProvinceList')) : this.getStateProvince());
    }

    private setStateProvinceList(stateProvinceList: StateProvince[]): void {
        this.stateProvinceList = stateProvinceList;
        this.cacheService.set('stateProvinceList', stateProvinceList);
    }

    public getCountriesList(): Country[] {
        return this.countriesList ? this.countriesList :
            (JSON.parse(this.cacheService.get('countriesList')) ?
                JSON.parse(this.cacheService.get('countriesList')) : this.getCountries());
    }

    private setRegionalDistricts(regionalDistricts: string[]): void {
        this.regionalDistricts = regionalDistricts;
        this.cacheService.set('regionalDistrictsList', regionalDistricts);
    }

    public getRegionalDistricts(): string[] {
        return this.regionalDistricts ? this.regionalDistricts :
            JSON.parse(this.cacheService.get('regionalDistrictsList'));
    }

    private setCountriesList(countriesList: Country[]): void {
        this.countriesList = countriesList;
        this.cacheService.set('countriesList', countriesList);
    }

    private getCommunities(): Community[] {
        let communities: Community[] = [];
        this.locationsService.locationsGetCommunities().subscribe((commumities: Community[]) => {
            communities = commumities;
            this.setCommunityList(communities);
            this.setRegionalDistricts(commumities.map(comm => comm.districtName));
        });
        return communities;
    }

    private getStateProvince(): StateProvince[] {
        let stateProvinces: StateProvince[] = [];
        this.locationsService.locationsGetStateProvinces().subscribe((stateProvince: StateProvince[]) => {
            stateProvinces = stateProvince;
            this.setStateProvinceList(stateProvince);
        });
        return stateProvinces;
    }

    private getCountries(): Country[] {
        let countries: Country[] = [];
        this.locationsService.locationsGetCountries().subscribe((countriesList: Country[]) => {
            countries = countriesList;
            this.setCountriesList(countries);
        });
        return countries;
    }
}
