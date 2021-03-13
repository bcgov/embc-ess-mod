import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TeamMember } from 'src/app/core/api/models';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class TeamListService {

    constructor(private teamMembersService: TeamMembersService) {}

    public getTeamMembers(): Observable<TeamMember[]> {
       return this.teamMembersService.teamMembersGetTeamMembers();
    }

    public activateTeamMember(memberId: string): Observable<TeamMember[]> {
        return this.teamMembersService.teamMembersActivateTeamMember({memberId}).pipe(
            mergeMap((result) => {
                console.log(result);
                return this.getTeamMembers();
            })
        );
    }

    public deactivatedTeamMember(memberId: string): Observable<TeamMember[]> {
        return this.teamMembersService.teamMembersDeactivateTeamMember({memberId}).pipe(
            mergeMap((result) => {
                console.log(result);
                return this.getTeamMembers();
            })
        );
    }
}
