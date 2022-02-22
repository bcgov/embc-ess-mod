import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMemberResult } from 'src/app/core/api/models';
import { TeamsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberDetailsService {
  constructor(private teamMembersService: TeamsService) {}

  deleteTeamMember(memberId: string): Observable<TeamMemberResult> {
    return this.teamMembersService.teamsDeleteTeamMember({ memberId });
  }
}
