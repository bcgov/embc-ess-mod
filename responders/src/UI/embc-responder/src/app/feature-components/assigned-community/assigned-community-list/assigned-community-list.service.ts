import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamCommunitiesAssignmentsService } from 'src/app/core/api/services';
import { TeamCommunityModel } from 'src/app/core/models/team-community.model';
import { LocationsService } from 'src/app/core/services/locations.service';

@Injectable({ providedIn: 'root' })
export class AssignedCommunityListService {
  constructor(
    private teamCommunitiesAssignmentsService: TeamCommunitiesAssignmentsService,
    private locationsService: LocationsService
  ) {}

  public getAssignedCommunityList(): Observable<TeamCommunityModel[]> {
    return this.teamCommunitiesAssignmentsService
      .teamCommunitiesAssignmentsGetAssignedCommunities()
      .pipe(
        map((assignedCommunities: TeamCommunityModel[]) => {
          const allCommunities = this.locationsService.getCommunityList();
          return assignedCommunities.map((list) => {
            const found = allCommunities.find(
              (x) => x.code === list.communityCode
            );
            if (found) {
              list.allowSelect = false;
              list.conflict = false;
            }
            return this.mergeData(list, found);
          });
        })
      );
  }

  public getAllAssignedCommunityList(): Observable<TeamCommunityModel[]> {
    return this.teamCommunitiesAssignmentsService
      .teamCommunitiesAssignmentsGetAssignedCommunities({ forAllTeams: true })
      .pipe(
        map((assignedCommunities: TeamCommunityModel[]) => {
          const allCommunities = this.locationsService.getCommunityList();
          return assignedCommunities.map((list) => {
            const found = allCommunities.find(
              (x) => x.code === list.communityCode
            );
            if (found) {
              list.allowSelect = false;
              list.conflict = true;
            }
            return this.mergeData(list, found);
          });
        })
      );
  }

  private mergeData<T>(finalValue: T, incomingValue: Partial<T>): T {
    return { ...finalValue, ...incomingValue };
  }
}
