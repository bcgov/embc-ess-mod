import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamCommunitiesAssignmentsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class AssignedCommunityReviewService {
  constructor(
    private teamCommunitiesAssignmentsService: TeamCommunitiesAssignmentsService
  ) {}

  addCommunities(communityListId: string[]): Observable<void> {
    return this.teamCommunitiesAssignmentsService.teamCommunitiesAssignmentsAssignCommunities(
      { body: communityListId }
    );
  }

  removeCommunities(communityListId: string[]): Observable<void> {
    return this.teamCommunitiesAssignmentsService.teamCommunitiesAssignmentsRemoveCommunities(
      { communityCodes: communityListId }
    );
  }
}
