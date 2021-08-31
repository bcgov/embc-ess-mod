import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class EditTeamMemberService {
  constructor(private teamMembersService: TeamsService) {}

  checkUserNameExists(userName: string): Observable<boolean> {
    return this.teamMembersService.teamsIsUserNameExists({ userName });
  }
}
