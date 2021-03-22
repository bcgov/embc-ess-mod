import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMembersService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class EditTeamMemberService {

  constructor(private teamMembersService: TeamMembersService) { }

  checkUserNameExists(userName: string): Observable<boolean> {
    return this.teamMembersService.teamMembersIsUserNameExists({ userName });
  }

}
