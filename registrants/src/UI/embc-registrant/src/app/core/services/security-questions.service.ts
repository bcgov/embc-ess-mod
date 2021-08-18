import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {
  private securityQuestionOptionsVal: string[];

  constructor(private configurationService: ConfigurationService) {}

  set securityQuestionOptions(securityQuestionOptionsVal: string[]) {
    this.securityQuestionOptionsVal = securityQuestionOptionsVal;
  }

  get securityQuestionOptions(): string[] {
    return this.securityQuestionOptionsVal;
  }

  /**
   * Get list of approved Security Questions from API to populate dropdown
   *
   * @returns string[] list of security questions
   */
  getSecurityQuestionList(): void {
    this.configurationService
      .configurationGetSecurityQuestions()
      .subscribe((list) => {
        this.securityQuestionOptions = list;
      });
  }
}
