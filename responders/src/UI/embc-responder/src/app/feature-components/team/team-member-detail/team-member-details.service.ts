import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember, TeamMemberResult } from 'src/app/core/api/models';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberDetailsService {
  constructor(private teamMembersService: TeamMembersService) {}

  deleteTeamMember(memberId: string): Observable<TeamMemberResult> {
    return this.teamMembersService.teamMembersDeleteTeamMember({ memberId });
  }
}
