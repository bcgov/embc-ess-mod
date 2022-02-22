import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../api/services';

@Injectable({ providedIn: 'root' })
export class EmailInviteService {
  constructor(private profileService: ProfileService) {}

  public validateInvite(inviteId: string): Observable<boolean> {
    return this.profileService.profileProcessInvite({
      body: { token: inviteId }
    });
  }
}
