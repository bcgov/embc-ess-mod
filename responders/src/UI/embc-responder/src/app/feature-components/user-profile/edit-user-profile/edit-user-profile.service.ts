import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class EditUserProfileService {
  constructor(private profileService: ProfileService) {}

  /**
   *
   * @param firstName user profile first name
   * @param lastName user profile last name
   * @param phone user profile phone number
   * @param email user profile email address
   * @returns an void observable
   */
  public editUserProfile(
    firstName: string,
    lastName: string,
    phone: string,
    email: string
  ): Observable<void> {
    return this.profileService.profileUpdate({
      body: {
        firstName,
        lastName,
        phone,
        email
      }
    });
  }
}
