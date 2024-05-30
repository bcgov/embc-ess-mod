import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInUserProfile, UserService } from 'src/app/core/services/user.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-responder-dashboard',
  templateUrl: './responder-dashboard.component.html',
  styleUrls: ['./responder-dashboard.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardContent, MatButton]
})
export class ResponderDashboardComponent {
  public get profile(): LoggedInUserProfile {
    return this.userService.currentProfile;
  }

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  signinTask(): void {
    this.router.navigate(['/responder-access/search']);
  }

  isTaskSignedIn(): boolean {
    return this.profile?.taskNumber !== null;
  }

  evacueeSearch(): void {
    this.router.navigate(['/responder-access/search/evacuee']);
  }
}
