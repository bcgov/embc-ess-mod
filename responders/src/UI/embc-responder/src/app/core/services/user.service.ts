import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfile?: UserProfile = null;

  constructor() { }

  public handleLogin(): Promise<string> {
    this.userProfile = {
      userId: '123',
      userName: 'Avisha S',
      firstName: 'first',
      lastName: 'last',
      role: 'r1',
      taskNumber: '123',
      teamId: '1',
      teamName: 'Oak Bay ESS Team'
    };
    return Promise.resolve('responder-access');
  }

  public get profile(): UserProfile {
    return this.userProfile;
  }

}

export interface UserProfile {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  taskNumber: string;
  teamName: string;
  teamId: string;
}
