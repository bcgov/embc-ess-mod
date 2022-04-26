import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/core/api/models';
import { UserService } from 'src/app/core/services/user.service';
import { DateConversionService } from 'src/app/core/services/utility/dateConversion.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss']
})
export class ViewUserProfileComponent implements OnInit {
  userProfile: UserProfile;

  constructor(
    private userService: UserService,
    private router: Router,
    public dateConversionService: DateConversionService
  ) {}

  /**
   * On init, calls the currentProfile to get the data and display it on screen
   */
  ngOnInit(): void {
    this.userProfile = this.userService.currentProfile;
  }

  /**
   * Navigates to the Edit Profile component
   */
  editProfile(): void {
    this.router.navigate(['/responder-access/user-profile/edit']);
  }
}
