import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetSecurityPhraseResponse,
  VerifySecurityPhraseRequest,
  VerifySecurityPhraseResponse
} from 'src/app/core/api/models';
import { RegistrationsService } from 'src/app/core/api/services';

@Injectable({
  providedIn: 'root'
})
export class EssFileSecurityPhraseService {
  private securityPhraseVal: GetSecurityPhraseResponse;

  constructor(private registrationService: RegistrationsService) {}

  public get securityPhrase(): GetSecurityPhraseResponse {
    return this.securityPhraseVal;
  }
  public set securityPhrase(value: GetSecurityPhraseResponse) {
    this.securityPhraseVal = value;
  }

  /**
   *
   * @param fileId selected ESSFile from the Search Results and needed to be validated
   * @returns the answer hint from the saved security phrase
   */
  public getSecurityPhrase(
    fileId: string
  ): Observable<GetSecurityPhraseResponse> {
    return this.registrationService.registrationsGetSecurityPhrase({ fileId });
  }

  /**
   *
   * @param fileId selected ESSFile from the Search Results and needed to be validated
   * @param body The secrurity phase given as an answer by the evacuee
   * @returns whether or not the given response is correct
   */
  public verifySecurityPhrase(
    fileId: string,
    body: VerifySecurityPhraseRequest
  ): Observable<VerifySecurityPhraseResponse> {
    return this.registrationService.registrationsVerifySecurityPhrase({
      fileId,
      body
    });
  }
}
