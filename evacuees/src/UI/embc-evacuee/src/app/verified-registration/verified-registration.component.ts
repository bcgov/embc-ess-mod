import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { FormCreationService } from '../core/services/formCreation.service';
import { ProfileMappingService } from '../core/services/profileMapping.service';
import { RegistrantProfileService } from '../core/services/registrantProfile.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {
  constructor(private formCreationService: FormCreationService, private dataService: DataService,
              private regProfService: RegistrantProfileService, private router: Router,
              public mappingService: ProfileMappingService) {
    this.dataService.clearData();
    this.formCreationService.clearData();
  }

  ngOnInit(): void {
    this.regProfService.getExistingProfile().subscribe(profile => {
      console.log(profile);
      this.mappingService.mapUserProfile(profile);
      if (profile.isNewUser) {
        this.router.navigate(['/verified-registration/collection-notice']);
      } else {
        this.router.navigate(['/verified-registration/view-profile']);
      }
    });
  }


}
