import { Injectable } from '@angular/core';
import { LoginService } from '../core/services/login.service';

@Injectable({ providedIn: 'root' })
export class MockLoginService extends LoginService {
  public async login(targetUrl: string = undefined): Promise<boolean> {
    return Promise.resolve(true);
  }
}
