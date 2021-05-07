import { Injectable } from '@angular/core';
import { SecurityQuestion } from './profile-security-questions.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileSecurityQuestionsService {
  constructor() {}

  /**
   * Method that randomizes the order of a given array of questions and hints
   *
   * @param securityQuestions array with security questions and hints
   * @returns the same array with its elements in different order
   */
  public shuffleSecurityQuestions(
    securityQuestions: SecurityQuestion[]
  ): SecurityQuestion[] {
    let currentIndex: number = securityQuestions.length;
    let temporaryValue: SecurityQuestion;
    let randomIndex: number;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = securityQuestions[currentIndex];
      securityQuestions[currentIndex] = securityQuestions[randomIndex];
      securityQuestions[randomIndex] = temporaryValue;
    }

    return securityQuestions;
  }
}
