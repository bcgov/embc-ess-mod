import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionsService {
  constructor(private configurationService: ConfigurationService) {}

  getSecurityQuestionList(): Observable<string[]> {
    return this.configurationService.configurationGetSecurityQuestions();
  }
}