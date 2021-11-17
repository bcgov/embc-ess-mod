import { Injectable } from '@angular/core';
import { ProfileService } from '../api/services';

@Injectable({ providedIn: 'root' })
export class EmailInviteService {
  constructor(private profileService: ProfileService) {}

  public async validateInvite(
    isLoggedIn: boolean,
    inviteId: string
  ): Promise<boolean> {
    if (inviteId !== undefined && isLoggedIn) {
      return this.profileService
        .profileProcessInvite({ body: { token: inviteId } })
        .toPromise();
    }
  }
}
