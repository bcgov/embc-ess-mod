import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class FileSubmissionService {
  constructor(private profileService: ProfileService) {}

  inviteByEmail(address: string, fileId: string): Observable<void> {
    return this.profileService.profileInvite({
      body: { email: address, fileId }
    });
  }
}
