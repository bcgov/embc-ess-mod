/* eslint-disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class ServerPayload {
  nonce: string;
  captcha: string;
  validation: string;
  expiry: string;
}

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  private baseUrl: string;
  private automationValue?: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getCaptchaConfiguration().url;
    this.automationValue = this.configService.getCaptchaConfiguration().automationValue;
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
  }

  fetchData(nonce: string): Observable<HttpResponse<ServerPayload>> {
    return this.http.post<ServerPayload>(
      this.baseUrl + '/captcha',
      { nonce },
      { observe: 'response' }
    );
  }

  verifyCaptcha(nonce: string, answer: string, encryptedAnswer: string): Observable<HttpResponse<ServerPayload>> {
    return this.http.post<ServerPayload>(
      this.baseUrl + '/verify/captcha',
      { nonce, answer, validation: encryptedAnswer },
      { observe: 'response' }
    ).pipe(mergeMap(async response => {
      if (this.automationValue) {
        //automation captcha support
        const hashedAnswer = await this.hash(answer);
        response.body['valid'] = this.automationValue == hashedAnswer;
      }
      return response;
    }));
  }

  private async hash(string): Promise<string> {
    const hash = await crypto.subtle.digest("SHA-256", (new TextEncoder()).encode(string))
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
  }

  fetchAudio(validation: string, translation?: string): Observable<HttpResponse<string>> {
    const payload: any = { validation };
    if (translation) {
      payload.translation = translation;
    }
    return this.http.post<string>(
      this.baseUrl + '/captcha/audio',
      payload,
      { observe: 'response' }
    );
  }
}
