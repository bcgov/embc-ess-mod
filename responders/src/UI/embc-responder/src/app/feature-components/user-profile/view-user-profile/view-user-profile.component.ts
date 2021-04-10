import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TeamMember, UserProfile } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { UserService } from 'src/app/core/services/user.service';
import { TeamMemberDetailsService } from '../../team/team-member-detail/team-member-details.service';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss']
})
export class ViewUserProfileComponent implements OnInit {

  userProfile: UserProfile;
  userTeamMember: TeamMember;

  constructor(
    private teamMemberDetailsService: TeamMemberDetailsService, private userService: UserService,
    private router: Router, private cacheService: CacheService) {}

  ngOnInit(): void {
    this.userProfile = this.userService.currentProfile;
    this.teamMemberDetailsService.getTeamMember(this.userProfile?.id).subscribe(value => {
      console.log(value);
      this.userTeamMember = value;
      this.cacheService.set('userMemberTeamInfo', value);
    });
  }

  editProfile(): void {
    this.router.navigate(['/responder-access/user-profile/edit']);
  }

}
