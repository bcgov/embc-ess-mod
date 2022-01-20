import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SecurityQuestionsService } from '../core/services/security-questions.service';

@Injectable({
  providedIn: 'root'
})
export class MockSecurityQuestionsService extends SecurityQuestionsService {
  testQuestions = [
    'Test Question 1?',
    'Test Question 2?',
    'Test Question 3?',
    'Test Question 4?'
  ];
  getSecurityQuestionList(): Observable<string[]> {
    return of(this.testQuestions);
  }
}
