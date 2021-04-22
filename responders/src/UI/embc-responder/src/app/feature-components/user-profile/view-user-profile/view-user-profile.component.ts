import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/core/api/models';
import { UserService } from 'src/app/core/services/user.service';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss']
})
export class ViewUserProfileComponent implements OnInit {

  userProfile: UserProfile;

  constructor(
    private userService: UserService, private router: Router,
    public userProfileServices: UserProfileService) {}

  ngOnInit(): void {
    this.userProfile = this.userProfileServices.getUserProfile();
  }

  editProfile(): void {
    this.router.navigate(['/responder-access/user-profile/edit']);
  }

}
