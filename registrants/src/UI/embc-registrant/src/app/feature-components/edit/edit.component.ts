import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { EvacuationFileService } from '../../sharedModules/components/evacuation-file/evacuation-file.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { ProfileService } from '../profile/profile.service';
import { EditService } from './edit.service';
import * as globalConst from '../../core/services/globalConstants';
import { AppSessionService } from 'src/app/core/services/appSession.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  componentToLoad: string;
  profileFolderPath: string;
  needsAssessmentNavigationExtras: NavigationExtras = {
    state: { stepIndex: 5 }
  };
  profileNavigationExtras: NavigationExtras = { state: { stepIndex: 4 } };
  form$: Subscription;
  form: UntypedFormGroup;
  editHeading: string;
  currentFlow: string;
  parentPageName: string;
  showLoader = false;
  nonVerfiedRoute = '/non-verified-registration/needs-assessment';
  verifiedRoute = '/verified-registration/create-profile';
  verifiedNeedsAssessments = '/verified-registration/needs-assessment';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private profileService: ProfileService,
    private profileDataService: ProfileDataService,
    private evacuationFileDataService: EvacuationFileDataService,
    private alertService: AlertService,
    private editService: EditService,
    private evacuationFileService: EvacuationFileService,
    private appSessionService: AppSessionService,
    private cd: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state !== undefined) {
      const state = navigation.extras.state as { parentPageName: string };
      this.parentPageName = state.parentPageName;
      this.appSessionService.editParentPage = state.parentPageName;
    }
  }

  /**
   * Initializes the user flow and listens for route
   * parameters
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.route.paramMap.subscribe((params) => {
      this.componentToLoad = params.get('type');
      this.loadForm(this.componentToLoad);
    });
    this.cd.detectChanges();
  }

  /**
   * Saves the updates information and navigates to review
   * page
   */
  save(): void {
    this.editService.saveFormData(
      this.componentToLoad,
      this.form,
      this.currentFlow
    );
    if (this.currentFlow === 'non-verified-registration') {
      this.router.navigate(
        [this.nonVerfiedRoute],
        this.needsAssessmentNavigationExtras
      );
    } else {
      if (this.appSessionService.editParentPage === 'create-profile') {
        this.router.navigate(
          [this.verifiedRoute],
          this.profileNavigationExtras
        );
      } else if (this.appSessionService.editParentPage === 'dashboard') {
        this.showLoader = !this.showLoader;
        this.profileService
          .upsertProfile(this.profileDataService.createProfileDTO())
          .subscribe({
            next: (profileId) => {
              this.showLoader = !this.showLoader;
              this.router.navigate([
                '/verified-registration/dashboard/profile'
              ]);
            },
            error: (error) => {
              this.showLoader = !this.showLoader;
              this.alertService.setAlert(
                'danger',
                globalConst.editProfileError
              );
            }
          });
      } else if (this.appSessionService.editParentPage === 'needs-assessment') {
        if (this.evacuationFileDataService.essFileId === undefined) {
          this.router.navigate(
            [this.verifiedNeedsAssessments],
            this.needsAssessmentNavigationExtras
          );
        } else {
          this.showLoader = !this.showLoader;
          this.evacuationFileService.updateEvacuationFile().subscribe({
            next: (essFileId) => {
              this.showLoader = !this.showLoader;
              this.router.navigate([
                '/verified-registration/dashboard/current/' + essFileId
              ]);
            },
            error: (error) => {
              this.showLoader = !this.showLoader;
              this.alertService.setAlert('danger', globalConst.editNeedsError);
            }
          });
        }
      }
    }
  }

  /**
   * Cancels the update operation and navigates to review
   * page
   */
  cancel(): void {
    this.editService.cancelFormData(
      this.componentToLoad,
      this.form,
      this.currentFlow
    );
    if (this.currentFlow === 'non-verified-registration') {
      this.router.navigate(
        [this.nonVerfiedRoute],
        this.needsAssessmentNavigationExtras
      );
    } else {
      if (this.appSessionService.editParentPage === 'create-profile') {
        this.router.navigate(
          [this.verifiedRoute],
          this.profileNavigationExtras
        );
      } else if (this.appSessionService.editParentPage === 'dashboard') {
        this.router.navigate(['/verified-registration/dashboard/profile']);
      } else if (this.appSessionService.editParentPage === 'needs-assessment') {
        if (this.evacuationFileDataService.essFileId !== undefined) {
          this.router.navigate([
            '/verified-registration/dashboard/current/' +
              this.evacuationFileDataService.essFileId
          ]);
        } else {
          this.router.navigate(
            [this.verifiedNeedsAssessments],
            this.needsAssessmentNavigationExtras
          );
        }
      }
    }
  }

  /**
   * Loads the form into view
   *
   * @param component form name
   */
  loadForm(component: string): void {
    switch (component) {
      case 'restriction':
        this.form$ = this.formCreationService
          .getRestrictionForm()
          .subscribe((restriction) => {
            this.form = restriction;
          });
        this.editHeading = 'Edit Restriction';
        break;
      case 'personal-details':
        this.form$ = this.formCreationService
          .getPersonalDetailsForm()
          .subscribe((personalDetails) => {
            this.form = personalDetails;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'address':
        this.form$ = this.formCreationService
          .getAddressForm()
          .subscribe((address) => {
            this.form = address;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'contact-info':
        this.form$ = this.formCreationService
          .getContactDetailsForm()
          .subscribe((contactDetails) => {
            this.form = contactDetails;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'security-questions':
        this.form$ = this.formCreationService
          .getSecurityQuestionsForm()
          .subscribe((questions) => {
            this.form = questions;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'evac-address':
        this.form$ = this.formCreationService
          .getEvacuatedForm()
          .subscribe((evacuatedForm) => {
            this.form = evacuatedForm;
          });
        this.editHeading = 'Edit Evacuation File';
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'family-information':
        this.form$ = this.formCreationService
          .getHouseholdMembersForm()
          .subscribe((householdMemberForm) => {
            this.form = householdMemberForm;
          });
        this.editHeading = 'Edit Evacuation File';
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'pets':
        this.form$ = this.formCreationService
          .getPetsForm()
          .subscribe((petsForm) => {
            this.form = petsForm;
          });
        this.editHeading = 'Edit Evacuation File';
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'identify-needs':
        this.form$ = this.formCreationService
          .getIndentifyNeedsForm()
          .subscribe((identifyNeedsForm) => {
            this.form = identifyNeedsForm;
          });
        this.editHeading = 'Edit Evacuation File';
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      case 'secret':
        this.form$ = this.formCreationService
          .getSecretForm()
          .subscribe((secret) => {
            this.form = secret;
          });
        this.editHeading = 'Edit Evacuation File';
        this.profileFolderPath = 'needs-assessment-forms';
        break;
      default:
    }
  }

  /**
   * Destroys the subscription on page destroy
   */
  ngOnDestroy(): void {
    this.form$.unsubscribe();
  }
}
