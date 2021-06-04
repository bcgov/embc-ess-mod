import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {
  constructor(private configurationService: ConfigurationService) {}

  /**
   * Get list of approved Security Questions from API to populate dropdown
   *
   * @returns string[] list of security questions
   */
  getSecurityQuestionList(): Observable<string[]> {
    return this.configurationService.configurationGetSecurityQuestions();
  }
}
