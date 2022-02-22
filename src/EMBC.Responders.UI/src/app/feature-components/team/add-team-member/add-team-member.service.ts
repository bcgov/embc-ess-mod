import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/app/core/api/models';
import { TeamsService } from 'src/app/core/api/services';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class AddTeamMemberService {
  private addedTeamMember: TeamMember;

  constructor(
    private teamMembersService: TeamsService,
    private cacheService: CacheService
  ) {}

  checkUserNameExists(userName: string): Observable<boolean> {
    return this.teamMembersService.teamsIsUserNameExists({ userName });
  }

  setAddedTeamMember(addedTeamMember: TeamMember): void {
    this.addedTeamMember = addedTeamMember;
  }

  getAddedTeamMember(): TeamMember {
    return this.addedTeamMember;
  }

  clear(): void {
    this.addedTeamMember = null;
  }
}
