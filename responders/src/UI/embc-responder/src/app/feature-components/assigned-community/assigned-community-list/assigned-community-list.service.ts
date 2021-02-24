import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssignedCommunity, Community } from 'src/app/core/api/models';
import { TeamCommunitiesAssignmentsService } from 'src/app/core/api/services';
import { LoadLocationsService } from 'src/app/core/services/load-locations.service';

@Injectable({ providedIn: 'root' })
export class AssignedCommunityListService {

    constructor(private teamCommunitiesAssignmentsService: TeamCommunitiesAssignmentsService, private loadLocationService: LoadLocationsService) { }

    public getAssignedCommunityList(): Observable<Community[]> {
        return this.teamCommunitiesAssignmentsService.teamCommunitiesAssignmentsGetAssignedCommunities().pipe(
            map((assignedCommunities: AssignedCommunity[]) => {
                let allCommunities = this.loadLocationService.getCommunityList();
                return assignedCommunities.map(list => {
                    return allCommunities.find(x => x.id === list.communityId)
                })
            })
        );
    }
}
