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

  public profile: LoggedInUserProfile;
  public get signedInTask(): string {
    return this.profile.taskNumber
      ? `Logged in to task #${this.profile.taskNumber}`
      : `Not logged in to a task`;
  }
  public get teamName(): string { return this.profile.teamName; }

  public get userName(): string { return this.profile.userName; }

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  public ngOnInit(): void {
    this.profile = this.userService.currentProfile;
  }

  homeButton(): void {

  }

  openUserProfile(): void {
    this.router.navigate(['/responder-access/user-profile']);
  }

  signOut(): void {
    this.authService.logout();
  }

}
