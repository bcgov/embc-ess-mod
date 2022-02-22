import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class EvacueeProfileDashboardService {
  constructor(private registrationService: RegistrationsService) {}

  inviteByEmail(address: string, registrantId: string): Observable<void> {
    return this.registrationService.registrationsInviteToRegistrantPortal({
      registrantId,
      body: { email: address }
    });
  }
}
