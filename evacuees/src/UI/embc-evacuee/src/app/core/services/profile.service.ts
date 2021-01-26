import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {

  }

  public async getProfileConflicts(): Promise<IProfile> {
    return await this.http.get<IProfile>('/api/profiles/current/conflicts').toPromise();
  }
}

interface IProfile {
  contactDetails: any;
  personalDetails: any;
  primaryAddress: any;
  mailingAddress: any;
}
