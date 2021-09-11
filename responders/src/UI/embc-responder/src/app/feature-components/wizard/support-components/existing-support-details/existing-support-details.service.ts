import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SupportReprintReason,
  SupportVoidReason
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class ExistingSupportDetailsService {
  constructor(private registrationService: RegistrationsService) {}

  voidSupport(
    fileId: string,
    supportId: string,
    voidReason: SupportVoidReason
  ): Observable<void> {
    return this.registrationService.registrationsVoidSupport({
      fileId,
      supportId,
      voidReason
    });
  }

  reprintSupport(
    fileId: string,
    supportId: string,
    reprintReason: SupportReprintReason
  ): Observable<void> {
    return this.registrationService.registrationsReprintSupport({
      fileId,
      supportId,
      reprintReason
    });
  }
}
