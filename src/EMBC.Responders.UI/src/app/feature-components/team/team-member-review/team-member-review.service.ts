import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember, TeamMemberResult } from 'src/app/core/api/models';
import { TeamsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberReviewService {
  constructor(private teamMembersService: TeamsService) {}

  updateTeamMember(
    memberId: string,
    teamMember: TeamMember
  ): Observable<TeamMemberResult> {
    return this.teamMembersService.teamsUpdateTeamMember({
      memberId,
      body: teamMember
    });
  }

  addTeamMember(teamMember: TeamMember): Observable<TeamMemberResult> {
    return this.teamMembersService.teamsCreateTeamMember({
      body: teamMember
    });
  }
}
