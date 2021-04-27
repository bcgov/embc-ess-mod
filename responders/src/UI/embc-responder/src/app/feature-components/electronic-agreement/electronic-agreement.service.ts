import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class ElectronicAgreementService {
  constructor(private profileService: ProfileService) {}

  public signAgreement(): Observable<void> {
    return this.profileService.profileSignAgreement();
  }
}
