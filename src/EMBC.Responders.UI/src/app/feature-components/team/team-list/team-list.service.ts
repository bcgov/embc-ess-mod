import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MemberLabelDescription, TeamMember } from 'src/app/core/api/models';
import { TeamsService } from 'src/app/core/api/services';
import { TeamMemberModel } from 'src/app/core/models/team-member.model';
import { LoadTeamListService } from 'src/app/core/services/load-team-list.service';

@Injectable({ providedIn: 'root' })
export class TeamListService {
  constructor(
    private teamMembersService: TeamsService,
    private listService: LoadTeamListService
  ) {}

  public getTeamMembers(): Observable<TeamMemberModel[]> {
    return this.teamMembersService.teamsGetTeamMembers().pipe(
      map((members: TeamMemberModel[]) => {
        const roles = this.listService.getMemberRoles();
        const labels: MemberLabelDescription[] =
          this.listService.getMemberLabels();
        return members.map((teamMember: TeamMemberModel) => {
          const matchedLabel = labels.find(
            (label) => label.code === teamMember.label
          );
          const matchedRole = roles.find(
            (role) => role.code === teamMember.role
          );
          if (matchedLabel) {
            teamMember.labelDescription = matchedLabel.description;
          }
          if (matchedRole) {
            teamMember.roleDescription = matchedRole.description;
          }
          return teamMember;
        });
      })
    );
  }

  public activateTeamMember(memberId: string): Observable<TeamMember[]> {
    return this.teamMembersService.teamsActivateTeamMember({ memberId }).pipe(
      mergeMap((result) => {
        return this.getTeamMembers();
      })
    );
  }

  public deactivatedTeamMember(memberId: string): Observable<TeamMember[]> {
    return this.teamMembersService.teamsDeactivateTeamMember({ memberId }).pipe(
      mergeMap((result) => {
        return this.getTeamMembers();
      })
    );
  }
}
