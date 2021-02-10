import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Profile, ProfileDataConflict } from 'src/app/core/api/models';
import { ProfileDataService } from '../profile/profile-data.service';
import { ProfileService } from '../profile/profile.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DataUpdationService } from 'src/app/core/services/dataUpdation.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-conflict-management',
  templateUrl: './conflict-management.component.html',
  styleUrls: ['./conflict-management.component.scss']
})
export class ConflictManagementComponent implements OnInit {

  updateAddressIndicator = false;
  folderPath = 'evacuee-profile-forms';
  componentName = 'address';
  eraProfile: Profile;
  loginProfile: Profile;
  conflicts: Array<ProfileDataConflict> = [];
  @ViewChild('conflictStepper') conflictStepper: MatStepper;
  showLoader = false;
  isSubmitted = false;
  form: FormGroup;

  constructor(private router: Router, private profileDataService: ProfileDataService, private profileService: ProfileService,
    private alertService: AlertService, private formCreationService: FormCreationService,
    private dataUpdation: DataUpdationService) { }

  ngOnInit(): void {
    this.profileDataService.getConflicts().subscribe(bcscConflicts => {
      this.conflicts = bcscConflicts;
      this.eraProfile = this.profileDataService.getProfile();
      this.loginProfile = this.profileDataService.getLoginProfile();
      if (this.conflicts) {
        this.loadAddressForm();
      }
    });
  }

  loadAddressForm(): void {
    if (this.conflicts.some(val => val.conflictDataElement === 'PrimaryAddress')) {
      this.formCreationService.getAddressForm().subscribe(updatedAddress => {
        this.form = updatedAddress;
      });
    }
  }

  toggleAddress(action?: string): void {
    this.updateAddressIndicator = !this.updateAddressIndicator;
    if (action === 'cancel') {
      // do something
    }
  }

  next(): void {
    if (this.conflictStepper.selectedIndex === this.conflictStepper.steps.length - 1) {
      this.updateProfileAndNavigate();
    } else {
      this.conflictStepper.next();
    }
  }

  navigateDashboard(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  conflictsResolved(): void {
    this.updateProfileAndNavigate();
  }

  updateProfileAndNavigate(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.updateConflicts();
    console.log(this.eraProfile);
    this.profileService.upsertProfile(this.eraProfile).subscribe(profileId => {
      console.log(profileId);
      this.router.navigate(['/verified-registration/dashboard']);
    },
      (error) => {
        console.log(error);
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.setAlert('danger', error.title);
      });
  }

  updateConflicts(): void {
    this.conflicts.forEach(value => {
      if (value.conflictDataElement === 'Name') {
        this.eraProfile.personalDetails.firstName = this.loginProfile.personalDetails.firstName;
        this.eraProfile.personalDetails.lastName = this.loginProfile.personalDetails.lastName;
      } else if (value.conflictDataElement === 'DateOfBirth') {
        this.eraProfile.personalDetails.dateOfBirth = this.loginProfile.personalDetails.dateOfBirth;
      } else if (value.conflictDataElement === 'PrimaryAddress') {
        console.log('here');
        this.eraProfile.primaryAddress = this.dataUpdation.setAddressObject(this.form.get('address').value);
        this.eraProfile.mailingAddress = this.dataUpdation.setAddressObject(this.form.get('mailingAddress').value);
      }
    });
  }

}
