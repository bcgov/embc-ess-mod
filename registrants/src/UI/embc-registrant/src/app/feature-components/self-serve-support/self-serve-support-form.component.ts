import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
  DraftSupports,
  ETransferDetails,
  SelfServeClothingSupport,
  SelfServeFoodGroceriesSupport,
  SelfServeFoodRestaurantSupport,
  SelfServeIncidentalsSupport,
  SelfServeShelterAllowanceSupport,
  SelfServeSupportType,
  SubmitSupportsRequest
} from 'src/app/core/api/models';
import { SupportsService } from 'src/app/core/api/services';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { EligibleSelfServeTotalAmountZeroDialogComponent } from './self-serve-support-total-amount-zero-dialog/self-serve-support-total-amount-zero.component';
import { AppLoaderComponent } from 'src/app/core/components/app-loader/app-loader.component';
import { tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { ETransferNotificationPreference } from 'src/app/core/model/e-transfer-notification-preference.model';
import {
  DraftSupportForm,
  SelfServeShelerAllowanceSupportForm,
  SupportDateForm,
  SelfServeFoodSupportForm,
  FundsFor,
  SelfServeFoodRestaurantSupportForm,
  SelfServeClothingSupportForm,
  SupportPersonForm,
  SelfServeIncidentsSupportForm,
  ETransferDetailsForm,
  SelfServeFoodGroceriesSupportForm
} from './self-serve-support.model';
import { SelfServeSupportDetailsFormComponent } from './self-serve-support-details-form/self-serve-support-details-form.component';
import { SelfServeSupportInteracETransfterFormComponent } from './self-serve-interac-e-transfer-form/self-serve-support-interac-e-transfer-form.component';
import {
  GotoStepType,
  SelfServeSupportReviewComponent
} from './self-serve-support-review/self-serve-support-review.component';

@Component({
  standalone: true,
  selector: 'app-self-serve-support-form',
  templateUrl: './self-serve-support-form.component.html',
  imports: [
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppLoaderComponent,
    SelfServeSupportDetailsFormComponent,
    SelfServeSupportInteracETransfterFormComponent,
    SelfServeSupportReviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './self-serve-support-form.component.scss'
})
export class SelfServeSupportFormComponent implements OnInit {
  isLinear = true;
  SelfServeSupportType = SelfServeSupportType;
  essFileId = this.needsAssessmentService.getVerifiedEvacuationFileNo();

  draftSupports: DraftSupports = {
    items: [],
    householdMembers: []
  };

  isLoadingDraftSupport = true;
  showButtonLoader = false;
  draftSupportError = false;
  calculateTotalsError = false;
  submitSupportError = false;
  loaderColor = '#169bd5';

  supportDraftForm = new FormGroup<DraftSupportForm>({
    shelterAllowance: new FormGroup<SelfServeShelerAllowanceSupportForm>({
      totalAmount: new FormControl<number>(0),
      includedHouseholdMembers: new FormArray<FormGroup<SupportPersonForm>>([]),
      nights: new FormArray<FormGroup<SupportDateForm>>([])
    }),
    food: new FormGroup<SelfServeFoodSupportForm>({
      fundsFor: new FormControl<FundsFor>(null, Validators.required),
      restaurant: new FormGroup<SelfServeFoodRestaurantSupportForm>({
        includedHouseholdMembers: new FormArray([]),
        mealTypes: new FormArray([]),
        totalAmount: new FormControl<number>(0)
      }),
      groceries: new FormGroup({
        includedHouseholdMembers: new FormArray<FormGroup<SupportPersonForm>>([]),
        nights: new FormArray<FormGroup<SupportDateForm>>([]),
        totalAmount: new FormControl<number>(0)
      })
    }),
    clothing: new FormGroup<SelfServeClothingSupportForm>({
      totalAmount: new FormControl(0),
      includedHouseholdMembers: new FormArray<FormGroup<SupportPersonForm>>([])
    }),
    incidents: new FormGroup<SelfServeIncidentsSupportForm>({
      totalAmount: new FormControl(0),
      includedHouseholdMembers: new FormArray<FormGroup<SupportPersonForm>>([])
    }),
    totals: new FormControl(0)
  });

  ETransferNotificationPreference = ETransferNotificationPreference;

  eTransferDetailsForm: FormGroup<ETransferDetailsForm> = this._formBuilder.group<ETransferDetailsForm>({
    notificationPreference: new FormControl(null),
    eTransferEmail: new FormControl('', [
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Email, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useEmailOnFile.value === false,
        Validators.required
      ),
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Email, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useEmailOnFile.value === false,
        Validators.email
      )
    ]),
    confirmEmail: new FormControl('', [
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Email, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useEmailOnFile.value === false,
        Validators.required
      ),
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Email, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useEmailOnFile.value === false,
        Validators.email
      )
    ]),
    contactEmail: new FormControl(
      '',
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Mobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ),
        Validators.required
      )
    ),
    confirmContactEmail: new FormControl(
      '',
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Mobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ),
        Validators.required
      )
    ),
    eTransferMobile: new FormControl(
      '',
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Mobile, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useMobileOnFile.value === false,
        Validators.required
      )
    ),
    confirmMobile: new FormControl('', [
      this.customValidation.conditionalValidation(
        () =>
          [ETransferNotificationPreference.Mobile, ETransferNotificationPreference.EmailAndMobile].includes(
            this.eTransferDetailsForm.controls.notificationPreference.value
          ) && this.eTransferDetailsForm.controls.useMobileOnFile.value === false,
        Validators.required
      )
    ]),
    useEmailOnFile: new FormControl(false),
    useMobileOnFile: new FormControl(false),
    recipientName: new FormControl()
  });

  reviewAcknowledgeForm = new FormGroup({
    fundsExclusive: new FormControl('', Validators.requiredTrue),
    meetMyOwnNeeds: new FormControl('', Validators.requiredTrue),
    information: new FormControl('', Validators.requiredTrue)
  });

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private supportService: SupportsService,
    public needsAssessmentService: NeedsAssessmentService,
    public profileDataService: ProfileDataService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private customValidation: CustomValidationService
  ) {}

  ngOnInit() {
    if (!this.essFileId) {
      return;
    }

    this.getDraft();
  }

  private getDraft() {
    this.supportService.supportsGetDraftSupports({ evacuationFileId: this.essFileId }).subscribe({
      next: (res) => {
        // Show the primary applicant at the top of the list
        res.householdMembers = res.householdMembers.sort((p) => {
          return p.isPrimaryRegistrant === true ? -1 : 1;
        });

        this.draftSupports = res;
      },
      error: (err) => {
        this.draftSupportError = true;
      },
      complete: () => {
        this.isLoadingDraftSupport = false;
      }
    });
  }

  gotoETransfterStep(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    if (!this.essFileId || formGroup.invalid) return;
    this.showButtonLoader = true;
    this.calculateTotalsError = false;
    this.calculateSelfServeSupportsTotalAmount().subscribe({
      next: (res) => {
        this.showButtonLoader = false;
        const selfServeSupportsTotalAmount = res.reduce((prev, curr) => prev + curr.totalAmount, 0);

        this.supportDraftForm.controls.totals.setValue(selfServeSupportsTotalAmount);

        if (selfServeSupportsTotalAmount === 0)
          this.dialog.open(EligibleSelfServeTotalAmountZeroDialogComponent, {}).afterClosed().subscribe();
        else this.stepper.next();
      },
      error: (err) => {
        this.calculateTotalsError = true;
        this.showButtonLoader = false;
      }
    });
  }

  gotoReviewStep(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    if (formGroup.invalid) return;
    this.stepper.next();
  }

  gotoStep(step: GotoStepType) {
    switch (step) {
      case 'supportDetails':
        this.stepper.selectedIndex = 0;
        break;
      case 'eTransfer':
        this.stepper.selectedIndex = 1;
        break;
      default:
        break;
    }
  }

  processShelterAllowanceData(
    supportForm: FormGroup<SelfServeShelerAllowanceSupportForm>
  ): SelfServeShelterAllowanceSupport | null {
    const supportFormValue = supportForm.value;

    const data: SelfServeShelterAllowanceSupport & { $type: 'SelfServeShelterAllowanceSupport' } = {
      $type: 'SelfServeShelterAllowanceSupport',
      type: SelfServeSupportType.ShelterAllowance,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportForm.controls.includedHouseholdMembers.controls
      .filter((c) => c.controls.isSelected.value === true)
      .map((c) => c.controls.personId.value);

    data.nights = supportForm.controls.nights.controls
      .filter((c) => c.controls.isSelected.value === true)
      .map((c) => c.controls.date.value.format('YYYY-MM-DD'));

    return data;
  }

  processFoodGroceriesData(
    supportForm: FormGroup<SelfServeFoodGroceriesSupportForm>
  ): SelfServeFoodGroceriesSupport | null {
    const supportFormValue = supportForm.value;

    const data: SelfServeFoodGroceriesSupport & { $type: 'SelfServeFoodGroceriesSupport' } = {
      $type: 'SelfServeFoodGroceriesSupport',
      type: SelfServeSupportType.FoodGroceries,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportForm.controls.includedHouseholdMembers.controls
      .filter((c) => c.controls.isSelected.value === true)
      .map((c) => c.controls.personId.value);

    data.nights = supportForm.controls.nights.controls
      .filter((c) => c.controls.isSelected.value === true)
      .map((c) => c.controls.date.value.format('YYYY-MM-DD'));

    return data;
  }

  processFoodRestaurantData(
    supportForm: FormGroup<SelfServeFoodRestaurantSupportForm>
  ): SelfServeFoodRestaurantSupport | null {
    const supportFormValue = supportForm.value;

    const data: SelfServeFoodRestaurantSupport & { $type: 'SelfServeFoodRestaurantSupport' } = {
      $type: 'SelfServeFoodRestaurantSupport',
      type: SelfServeSupportType.FoodRestaurant,
      totalAmount: supportFormValue.totalAmount,
      includedHouseholdMembers: [],
      meals: []
    };

    data.includedHouseholdMembers = supportFormValue.includedHouseholdMembers
      .filter((p) => p.isSelected)
      .map((p) => p.personId);

    data.meals = supportFormValue.mealTypes
      .filter((m) => m.breakfast || m.lunch || m.dinner)
      .map((m) => ({
        breakfast: m.breakfast,
        lunch: m.lunch,
        dinner: m.dinner,
        date: m.date.format('YYYY-MM-DD')
      }));

    return data;
  }

  processClothing(supportForm: FormGroup<SelfServeClothingSupportForm>) {
    const supportFormValue = supportForm.value;

    const data: SelfServeClothingSupport & { $type: 'SelfServeClothingSupport' } = {
      $type: 'SelfServeClothingSupport',
      type: SelfServeSupportType.Clothing,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportFormValue.includedHouseholdMembers
      .filter((m) => m.isSelected)
      .map((m) => m.personId);

    return data;
  }

  processIncidents(supportForm: FormGroup<SelfServeIncidentsSupportForm>) {
    const supportFormValue = supportForm.value;

    const data: SelfServeIncidentalsSupport & { $type: 'SelfServeIncidentalsSupport' } = {
      $type: 'SelfServeIncidentalsSupport',
      type: SelfServeSupportType.Incidentals,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportFormValue.includedHouseholdMembers
      .filter((m) => m.isSelected)
      .map((m) => m.personId);

    return data;
  }

  getPayloadData() {
    this.supportDraftForm.markAllAsTouched();

    const selfServeSupportRequest: SubmitSupportsRequest = {
      supports: []
    };

    this.draftSupports.items.forEach((support) => {
      switch (support.type) {
        case SelfServeSupportType.ShelterAllowance:
          const processShelterAllowance = this.processShelterAllowanceData(
            this.supportDraftForm.controls.shelterAllowance
          );
          if (processShelterAllowance) selfServeSupportRequest.supports.push(processShelterAllowance);
          break;

        case SelfServeSupportType.FoodGroceries:
          if (this.supportDraftForm.controls.food.controls.fundsFor.value === SelfServeSupportType.FoodGroceries) {
            const processFoodGroceries = this.processFoodGroceriesData(
              this.supportDraftForm.controls.food.controls.groceries
            );
            if (processFoodGroceries) selfServeSupportRequest.supports.push(processFoodGroceries);
          }
          break;

        case SelfServeSupportType.FoodRestaurant:
          if (this.supportDraftForm.controls.food.controls.fundsFor.value === SelfServeSupportType.FoodRestaurant) {
            const processFoodRestaurant = this.processFoodRestaurantData(
              this.supportDraftForm.controls.food.controls.restaurant
            );
            if (processFoodRestaurant) selfServeSupportRequest.supports.push(processFoodRestaurant);
          }
          break;

        case SelfServeSupportType.Clothing:
          const processClothing = this.processClothing(this.supportDraftForm.controls.clothing);
          if (processClothing) selfServeSupportRequest.supports.push(processClothing);
          break;

        case SelfServeSupportType.Incidentals:
          const processIncidents = this.processIncidents(this.supportDraftForm.controls.incidents);
          if (processIncidents) selfServeSupportRequest.supports.push(processIncidents);
          break;

        default:
          break;
      }
    });

    return selfServeSupportRequest;
  }

  calculateSelfServeSupportsTotalAmount() {
    const selfServeRequestPayload = this.getPayloadData();

    return this.supportService
      .supportsCalculateAmounts({
        evacuationFileId: this.essFileId,
        body: selfServeRequestPayload.supports
      })
      .pipe(
        tap((res) => {
          res.forEach((s) => {
            switch (s.type) {
              case SelfServeSupportType.ShelterAllowance:
                this.supportDraftForm.controls.shelterAllowance.controls.totalAmount.setValue(s.totalAmount);
                break;

              case SelfServeSupportType.FoodGroceries:
                this.supportDraftForm.controls.food.controls.groceries.controls.totalAmount.setValue(s.totalAmount);
                break;

              case SelfServeSupportType.FoodRestaurant:
                this.supportDraftForm.controls.food.controls.restaurant.controls.totalAmount.setValue(s.totalAmount);
                break;

              case SelfServeSupportType.Clothing:
                this.supportDraftForm.controls.clothing.controls.totalAmount.setValue(s.totalAmount);
                break;

              case SelfServeSupportType.Incidentals:
                this.supportDraftForm.controls.incidents.controls.totalAmount.setValue(s.totalAmount);
                break;

              default:
                break;
            }
          });
        })
      );
  }

  submit() {
    this.supportDraftForm.markAllAsTouched();
    this.eTransferDetailsForm.markAllAsTouched();
    this.reviewAcknowledgeForm.markAllAsTouched();
    if (this.supportDraftForm.invalid || this.eTransferDetailsForm.invalid || this.reviewAcknowledgeForm.invalid)
      return;

    const selfServeSupportsPayload = this.getPayloadData();

    const eTransferFormDetailsValue = this.eTransferDetailsForm.value;
    const eTransferDetails: ETransferDetails = {
      recipientName: eTransferFormDetailsValue.recipientName
    };

    switch (eTransferFormDetailsValue.notificationPreference) {
      case ETransferNotificationPreference.Email:
        eTransferDetails.eTransferEmail = eTransferFormDetailsValue.eTransferEmail;
        break;

      case ETransferNotificationPreference.Mobile:
        eTransferDetails.eTransferMobile = eTransferFormDetailsValue.eTransferMobile;
        if (eTransferFormDetailsValue.contactEmail)
          eTransferDetails.contactEmail = eTransferFormDetailsValue.contactEmail;
        break;

      case ETransferNotificationPreference.EmailAndMobile:
        eTransferDetails.eTransferEmail = eTransferFormDetailsValue.eTransferEmail;
        eTransferDetails.eTransferMobile = eTransferFormDetailsValue.eTransferMobile;
        break;

      default:
        break;
    }

    const selfServeRequestPayload: SubmitSupportsRequest = {
      evacuationFileId: this.essFileId,
      supports: selfServeSupportsPayload.supports,
      eTransferDetails
    };

    this.showButtonLoader = true;
    this.submitSupportError = false;
    this.supportService
      .supportsSubmitSupports({ evacuationFileId: this.essFileId, body: selfServeRequestPayload })
      .subscribe({
        next: (res) => {
          this.showButtonLoader = false;
          this.router.navigate(['/verified-registration/dashboard'], {
            state: {
              selfServe: true,
              supportData: {
                notificationPreference: this.eTransferDetailsForm.controls.notificationPreference.value,
                eTransferDetails: selfServeRequestPayload.eTransferDetails,
                totalAmount: this.supportDraftForm.controls.totals.value
              }
            }
          });
        },
        error: (err) => {
          this.submitSupportError = true;
          this.showButtonLoader = false;
        }
      });
  }

  gotoEligibilityConfirmation() {
    this.router.navigate(['../confirm'], { relativeTo: this.route });
  }
}
