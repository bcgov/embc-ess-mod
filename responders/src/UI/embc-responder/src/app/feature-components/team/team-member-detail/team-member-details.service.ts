import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamMemberDetailsService {

    constructor(private teamMembersService: TeamMembersService) { }

    deleteTeamMember(memberId: string): Observable<void> {
       return this.teamMembersService.teamMembersDeleteTeamMember({memberId: memberId})
    }
}
