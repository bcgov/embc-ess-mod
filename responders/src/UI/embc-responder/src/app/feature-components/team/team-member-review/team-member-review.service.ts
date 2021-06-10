import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember, TeamMemberResult } from 'src/app/core/api/models';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberReviewService {
  constructor(private teamMembersService: TeamMembersService) {}

  updateTeamMember(
    memberId: string,
    teamMember: TeamMember
  ): Observable<TeamMemberResult> {
    return this.teamMembersService.teamMembersUpdateTeamMember({
      memberId,
      body: teamMember
    });
  }

  addTeamMember(teamMember: TeamMember): Observable<TeamMemberResult> {
    return this.teamMembersService.teamMembersCreateTeamMember({
      body: teamMember
    });
  }
}
