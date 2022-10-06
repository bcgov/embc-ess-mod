import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggedInUserProfile, UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public get profile(): LoggedInUserProfile {
    return this.userService.currentProfile;
  }
  public get signedInTask(): string {
    return this.profile.taskNumber
      ? `Task # ${this.profile.taskNumber}`
      : `Not signed in to a task #`;
  }

  public get taskStatus(): string {
    return this.profile.taskStatus;
  }
  public get teamName(): string {
    return this.profile.teamName;
  }

  public get userName(): string {
    return this.profile.userName;
  }

  public get displayName(): string {
    return [
      this.profile.firstName,
      this.profile.lastName?.charAt(0).toUpperCase()
    ].join(' ');
  }

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {}

  public homeButton(): void {
    if (this.router.url !== '/outage' && this.router.url !== '/access-denied') {
      this.router.navigate(['/responder-access']);
    }
  }

  public openUserProfile(): void {
    this.router.navigate(['/responder-access/user-profile']);
  }

  public signOut(): void {
    this.userService.clearAppStorage();
    this.authService.logout();
  }

  public showUserProfile(): boolean {
    return this.profile != null;
  }

  newTaskSignIn(): void {
    this.router.navigate(['/responder-access/search/task']);
  }

  allowSignIn(): boolean {
    return this.profile.taskNumber !== null;
  }

  allowMyProfile(): boolean {
    return this.profile.requiredToSignAgreement === false;
  }
}
