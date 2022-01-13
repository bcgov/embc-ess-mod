import { Injectable } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class MockAuthService extends AuthenticationService {
  public login(): Promise<string> {
    return Promise.resolve('/responder-access');
  }
}
