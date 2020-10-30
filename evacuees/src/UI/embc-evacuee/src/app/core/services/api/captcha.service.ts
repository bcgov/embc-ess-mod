import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    constructor(private http: HttpClient) { }

    get headers(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }

    private readonly baseUrl = 'https://embcess-captcha.pathfinder.gov.bc.ca';


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
        );
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
