import { Injectable } from '@angular/core';
import { ProfileService } from '../api/services';

@Injectable({ providedIn: 'root' })
export class EmailInviteService {
  constructor(private profileService: ProfileService) {}

  public async validateInvite(
    isLoggedIn: boolean,
    inviteGuid: string
  ): Promise<boolean> {
    console.log('emailInvite');

    //Sample URL: http://localhost:5200/verified-registration?inviteId=d511b078-744e-4c77-9864-7f5b3666acfa
    if (inviteGuid !== undefined && isLoggedIn) {
      return this.profileService
        .profileProcessInvite({ body: { token: inviteGuid } })
        .toPromise();
    }
  }
}
