import { Injectable } from '@angular/core';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';

@Injectable({ providedIn: 'root' })
export class AddCommunityService {

    private addedCommunities: TeamCommunityModel[];

    constructor() { }

    public setAddedCommunities(addedCommunities: TeamCommunityModel[]): void {
        this.addedCommunities = addedCommunities;
    }

    public getAddedCommunities(): TeamCommunityModel[] {
       return this.addedCommunities;
    }
}
