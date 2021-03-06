import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetSecurityQuestionsResponse,
  SecurityQuestion,
  VerifySecurityQuestionsRequest,
  VerifySecurityQuestionsResponse
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class ProfileSecurityQuestionsService {
  constructor(private registrationService: RegistrationsService) {}

  /**
   * Method that randomizes the order of a given array of questions and hints
   *
   * @param securityQuestions array with security questions and hints
   * @returns the same array with its elements in different order
   */
  public shuffleSecurityQuestions(
    securityQuestions: Array<SecurityQuestion>
  ): Array<SecurityQuestion> {
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

  /**
   *
   * @param registrantId the ID used to look for the registrant
   * @returns an Array of questions selected previously by the registrant during the creation of the profile
   */
  public getSecurityQuestions(
    registrantId: string
  ): Observable<GetSecurityQuestionsResponse> {
    return this.registrationService.registrationsGetSecurityQuestions({
      registrantId
    });
  }

  /**
   *
   * @param registrantId current search and selected registrant to verify their security questions
   * @param body an Array of security questions with answer to be sent to the API
   * @returns number of correct answers from the given body
   */
  public verifySecurityQuestions(
    registrantId: string,
    body: VerifySecurityQuestionsRequest
  ): Observable<VerifySecurityQuestionsResponse> {
    return this.registrationService.registrationsVerifySecurityQuestions({
      registrantId,
      body
    });
  }
}
