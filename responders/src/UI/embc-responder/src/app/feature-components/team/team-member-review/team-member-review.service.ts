import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/app/core/api/models';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberReviewService {
  constructor(private teamMembersService: TeamMembersService) {}

  updateTeamMember(memberId: string, teamMember: TeamMember): Observable<void> {
    return this.teamMembersService.teamMembersUpdateTeamMember({
      memberId,
      body: teamMember,
    });
  }

  addTeamMember(teamMember: TeamMember): Observable<void> {
    return this.teamMembersService.teamMembersCreateTeamMember({
      body: teamMember,
    });
  }
}
