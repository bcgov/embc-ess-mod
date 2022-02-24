import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GetSecurityQuestionsResponse } from '../core/api/models';
import { ProfileSecurityQuestionsService } from '../feature-components/search/profile-security-questions/profile-security-questions.service';

@Injectable({
  providedIn: 'root'
})
export class MockProfileSecurityQuestionsService extends ProfileSecurityQuestionsService {
  public securityQuestionsValue: GetSecurityQuestionsResponse;

  public getSecurityQuestions(
    registrantId: string
  ): Observable<GetSecurityQuestionsResponse> {
    return new BehaviorSubject<GetSecurityQuestionsResponse>(
      this.securityQuestionsValue
    );
  }
}
