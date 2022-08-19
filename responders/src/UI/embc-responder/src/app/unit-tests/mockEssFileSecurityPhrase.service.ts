import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GetSecurityPhraseResponse } from '../core/api/models/get-security-phrase-response';
import { EssFileSecurityPhraseService } from '../feature-components/search/essfile-security-phrase/essfile-security-phrase.service';

@Injectable({
  providedIn: 'root'
})
export class MockEssFileSecurityPhraseService extends EssFileSecurityPhraseService {
  public mockSecurityPhraseValue: GetSecurityPhraseResponse = {
    securityPhrase: 's****e'
  };

  public getSecurityPhrase(
    fileId: string
  ): Observable<GetSecurityPhraseResponse> {
    return new BehaviorSubject<GetSecurityPhraseResponse>(
      this.mockSecurityPhraseValue
    );
  }
}
