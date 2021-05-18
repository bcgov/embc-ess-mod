import { AfterViewInit, Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Profile, ProfileDataConflict } from 'src/app/core/api/models';
import { ProfileDataService } from '../profile/profile-data.service';
import { ProfileService } from '../profile/profile.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { FormGroup } from '@angular/forms';
import { ConflictManagementService } from './conflict-management.service';

@Component({
  selector: 'app-conflict-management',
  templateUrl: './conflict-management.component.html',
  styleUrls: ['./conflict-management.component.scss']
})
export class ConflictManagementComponent implements OnInit, DoCheck {

  @ViewChild('conflictStepper') conflictStepper: MatStepper;
  updateAddressIndicator = false;
  folderPath = 'evacuee-profile-forms';
  componentName = 'address';
  conflicts: Array<ProfileDataConflict> = [];
  showLoader = false;
  isSubmitted = false;
  form: FormGroup;
  nameConflict: ProfileDataConflict;
  dobConflict: ProfileDataConflict;
  addressConflict: ProfileDataConflict;
  profile: Profile;

  constructor(
    private router: Router, private profileDataService: ProfileDataService, private profileService: ProfileService,
    private alertService: AlertService, private formCreationService: FormCreationService,
    private conflictService: ConflictManagementService) { }

  ngDoCheck(): void {
    if (!this.profile) {
      this.profile = this.profileDataService.getProfile();
    }
  }

  ngOnInit(): void {
    this.conflictService.getConflicts().subscribe(bcscConflicts => {
      this.conflicts = bcscConflicts;
      console.log(this.conflicts);
      this.nameConflict = bcscConflicts.find(element => element.dataElementName === 'NameDataConflict');
      this.dobConflict = bcscConflicts.find(element => element.dataElementName === 'DateOfBirthDataConflict');
      this.addressConflict = bcscConflicts.find(element => element.dataElementName === 'AddressDataConflict');
      if (this.conflicts) {
        this.loadAddressForm();
      }
    });
  }

  loadAddressForm(): void {
    if (this.conflicts.some(val => val.dataElementName === 'AddressDataConflict')) {
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

  next(stepName: string): void {
    if (stepName === 'name') {
      this.resolveNameConflict();
    } else if (stepName === 'dob') {
      this.resolveDOBConflict();
    }
    if (this.conflictStepper.selectedIndex === this.conflictStepper.steps.length - 1) {
      this.updateProfileAndNavigate();
    } else {
      this.conflictStepper.next();
    }
  }

  navigateDashboard(): void {
    if (this.nameConflict || this.dobConflict) {
      this.updateProfileAndNavigate();
    } else {
      this.router.navigate(['/verified-registration/dashboard']);
    }
  }

  conflictsResolved(): void {
    this.resolveAddressConflict();
    this.updateProfileAndNavigate();
  }

  resolveNameConflict(): void {
    if (this.nameConflict) {
      this.profile.personalDetails.firstName = this.nameConflict.conflictingValue.item1;
      this.profile.personalDetails.lastName = this.nameConflict.conflictingValue.item2;
    }
  }

  resolveDOBConflict(): void {
    if (this.dobConflict) {
      this.profile.personalDetails.dateOfBirth = this.dobConflict.conflictingValue;
    }
  }

  resolveAddressConflict(): void {
    if (this.addressConflict) {
      this.profile.primaryAddress = this.profileDataService.setAddressObject(this.form.get('address').value);
      this.profile.mailingAddress = this.profileDataService.setAddressObject(this.form.get('mailingAddress').value);
    }
  }


  updateProfileAndNavigate(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.profileService.upsertProfile(this.profile).subscribe(profileId => {
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

}
