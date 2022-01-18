import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoggedInUserProfile,
  UserService
} from 'src/app/core/services/user.service';

@Component({
  selector: 'app-responder-dashboard',
  templateUrl: './responder-dashboard.component.html',
  styleUrls: ['./responder-dashboard.component.scss']
})
export class ResponderDashboardComponent implements OnInit {
  public get profile(): LoggedInUserProfile {
    return this.userService.currentProfile;
  }

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

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
