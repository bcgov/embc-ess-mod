import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataUpdationService } from 'src/app/core/services/dataUpdation.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  componentToLoad: string;
  profileFolderPath: string;
  navigationExtras: NavigationExtras = { state: { stepIndex: 4 } };
  form$: Subscription;
  form: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, public updateService: DataUpdationService,
              private formCreationService: FormCreationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.componentToLoad = params.get('type');
      this.loadForm(this.componentToLoad);
    });
  }

  save(): void {
    this.setFormData(this.componentToLoad);
    this.router.navigate(['/non-verified-registration/needs-assessment'], this.navigationExtras);
  }

  cancel(): void {
    this.router.navigate(['/non-verified-registration/needs-assessment'], this.navigationExtras);
  }

  setFormData(component: string): void {
    switch (component) {
      case 'personal-details':
        this.updateService.updatePersonalDetails(this.form);
        break;
      case 'address':
        this.updateService.updateAddressDetails(this.form);
        break;
      case 'contact-info':
        this.updateService.updateContactDetails(this.form);
        break;
      case 'secret':
        this.updateService.updateSecretDetails(this.form);
        break;
      case 'evac-address':
        this.updateService.updateEvacuationDetails(this.form);
        break;
      case 'family-information':
        this.updateService.updateFamilyMemberDetails(this.form);
        break;
      case 'pets':
        this.updateService.updatePetsDetails(this.form);
        break;
      case 'identify-needs':
        this.updateService.updateNeedsDetails(this.form);
        break;
      default:
    }
  }

  loadForm(component: string): void {
    switch (component) {
      case 'personal-details':
        this.form$ = this.formCreationService.getPeronalDetailsForm().subscribe(
          personalDetails => {
            this.form = personalDetails;
          }
        );
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'address':
        this.form$ = this.formCreationService.getAddressForm().subscribe(
          address => {
            this.form = address;
          }
        );
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'contact-info':
        this.form$ = this.formCreationService.getContactDetailsForm().subscribe(
          contactDetails => {
            this.form = contactDetails;
          }
        );
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'secret':
        this.form$ = this.formCreationService.getSecretForm().subscribe(
          secret => {
            this.form = secret;
          }
        );
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'evac-address':
        this.form$ = this.formCreationService.getEvacuatedForm().subscribe(
          evacuatedForm => {
            this.form = evacuatedForm;
          }
        );
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'family-information':
        this.form$ = this.formCreationService.getFamilyMembersForm().subscribe(
          memberForm => {
            this.form = memberForm;
          }
        );
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'pets':
        this.form$ = this.formCreationService.getPetsForm().subscribe(
          petsForm => {
            this.form = petsForm;
          }
        );
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'identify-needs':
        this.form$ = this.formCreationService.getIndentifyNeedsForm().subscribe(
          identifyNeedsForm => {
            this.form = identifyNeedsForm;
          }
        );
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      default:
    }
  }

}
