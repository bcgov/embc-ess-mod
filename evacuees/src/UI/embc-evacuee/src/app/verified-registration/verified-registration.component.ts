import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { DataService } from '../core/services/data.service';
import { FormCreationService } from '../core/services/formCreation.service';
import { ProfileService } from '../core/services/profile.service';

@Component({
  selector: 'app-verified-registration',
  templateUrl: './verified-registration.component.html',
  styleUrls: ['./verified-registration.component.scss']
})
export class VerifiedRegistrationComponent implements OnInit {

  constructor(
    private formCreationService: FormCreationService,
    private dataService: DataService,
    private profileService: ProfileService) { }

  ngOnInit(): void {
    this.dataService.clearData();
    this.formCreationService.clearData();

    const profile = of(this.profileService.getUserProfile());
    console.log(profile);
  }

}
