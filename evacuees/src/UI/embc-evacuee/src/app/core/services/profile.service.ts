import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {

  }

  public async getUserProfile(): Promise<IProfile> {
    return await this.http.get<IProfile>('/api/profile').toPromise();
  }
}

interface IProfile {
  contactDetails: any;
  personalDetails: any;
  primaryAddress: any;
  mailingAddress: any;
}
