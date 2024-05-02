import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import * as moment from 'moment';
import {
  DraftSupports,
  HouseholdMember,
  SelfServeClothingSupport,
  SelfServeFoodGroceriesSupport,
  SelfServeFoodRestaurantSupport,
  SelfServeIncidentalsSupport,
  SelfServeShelterAllowanceSupport,
  SelfServeSupport,
  SelfServeSupportType,
  SubmitSupportsRequest,
  SupportDay,
  SupportSubCategory
} from 'src/app/core/api/models';
import { SupportsService } from 'src/app/core/api/services';
import { EvacuationFileDataService } from 'src/app/sharedModules/components/evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { EligibleSelfServeTotalAmountZeroDialogComponent } from './eligible-self-serve-total-amount-zero.component';
import { AppLoaderComponent } from 'src/app/core/components/app-loader/app-loader.component';
import { tap } from 'rxjs';

type SelfServeSupportFormControl = {
  [k in keyof SelfServeSupport]: FormControl<SelfServeSupport[k]>;
};

interface BaseSelfServeSupportForm extends Omit<SelfServeSupportFormControl, '$type'> {
  totalAmount: FormControl<number>;
}

interface SupportPersonForm {
  personId: FormControl<string>;
  isSelected?: FormControl<boolean>;
}

interface SupportPersonDateForm {
  date: FormControl<moment.Moment>;
  personId: FormControl<string>;
  isSelected?: FormControl<boolean>;
}

type SupportDayFormControl = {
  [k in keyof SupportDay]: FormControl<SupportDay[k]>;
};

interface SelfServeSupportDayMealForm extends Omit<SupportDayFormControl, 'date'> {
  date: FormControl<moment.Moment>;
  breakfast: FormControl<boolean>;
  lunch: FormControl<boolean>;
  dinner: FormControl<boolean>;
}

type FundsFor = SupportSubCategory.FoodGroceries | SupportSubCategory.FoodRestaurant | null;

interface SelfServeFoodRestaurantSupportForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
  mealTypes: FormArray<FormGroup<SelfServeSupportDayMealForm>>;
  totalAmount: FormControl<number>;
}

interface SelfServeFoodGroceriesSupportForm {
  nights: FormArray<FormGroup<SupportPersonDateForm>>;
  totalAmount: FormControl<number>;
}

interface SelfServeFoodSupportForm {
  fundsFor: FormControl<FundsFor>;
  restaurant: FormGroup<SelfServeFoodRestaurantSupportForm>;
  groceries: FormGroup<SelfServeFoodGroceriesSupportForm>;
}

interface SelfServeShelerAllowanceSupportForm extends BaseSelfServeSupportForm {
  nights: FormArray<FormGroup<SupportPersonDateForm>>;
}

interface SelfServeClothingSupportForm extends BaseSelfServeSupportForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
}

interface SelfServeIncidentsSupportForm extends BaseSelfServeSupportForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
}

interface DraftSupportForm {
  shelterAllowance: FormGroup<SelfServeShelerAllowanceSupportForm>;
  food: FormGroup<SelfServeFoodSupportForm>;
  clothing: FormGroup<SelfServeClothingSupportForm>;
  incidents: FormGroup<SelfServeIncidentsSupportForm>;
}

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-support-form',
  templateUrl: './eligible-self-serve-support-form.component.html',
  imports: [
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AppLoaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      mat-card {
        margin-bottom: var(--size-3);
      }

      .mat-mdc-card-content,
      .mat-mdc-card-content:first-child,
      .mat-mdc-card-content:last-child {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-3);
        justify-content: space-between;
        padding: var(--size-3);
      }

      :host .mat-mdc-checkbox ::ng-deep label {
        font-weight: bold;
        font-size: var(--size-2);
        line-height: var(--size-6);
      }

      .card-question {
        font-size: var(--size-2);
        margin-bottom: var(--size-2);
      }

      table {
        min-width: 400px;
      }

      th {
        font-weight: bold;
        padding: var(--size-1);
      }

      td {
        width: 150px;
        word-break: break-word;
        padding: var(--size-1);
      }

      tr.header-row {
        height: 60px;
        background: #f2f2f2;
      }

      .note-box {
        flex: 1 0 300px;
        max-width: 400px;
        height: min-content;
        padding: var(--size-2);
      }
    `
  ]
})
export class EligibleSelfServeSupportFormComponent implements OnInit {
  isLinear = false;
  essFileId = this.needsAssessmentService.getVerifiedEvacuationFileNo();
  SupportSubCategory = SupportSubCategory;

  showSelfServeShelterAllowanceSupport = false;
  showSelfServeFoodSupport = false;
  showSelfServeClothingSupport = false;
  showSelfServeIncidentsSupport = false;

  shelterAllowanceDates: moment.Moment[] = [];
  foodGroceriesDates: moment.Moment[] = [];
  foodRestaurantDates: moment.Moment[] = [];

  draftSupports: DraftSupports = {
    items: [],
    householdMembers: []
  };

  isLoadingDraftSupport = true;
  showButtonLoader = false;
  draftSupportError = false;
  loaderColor = '#169bd5';

  supportDraftForm = new FormGroup<DraftSupportForm>({
    shelterAllowance: new FormGroup<SelfServeShelerAllowanceSupportForm>({
      totalAmount: new FormControl<number>(0),
      nights: new FormArray<FormGroup<SupportPersonDateForm>>([])
    }),
    food: new FormGroup<SelfServeFoodSupportForm>({
      fundsFor: new FormControl<FundsFor>(null, Validators.required),
      restaurant: new FormGroup<SelfServeFoodRestaurantSupportForm>({
        includedHouseholdMembers: new FormArray([]),
        mealTypes: new FormArray([]),
        totalAmount: new FormControl<number>(0)
      }),
      groceries: new FormGroup({
        nights: new FormArray<FormGroup<SupportPersonDateForm>>([]),
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
    })
  });

  eTransferForm: FormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    private supportService: SupportsService,
    public needsAssessmentService: NeedsAssessmentService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.essFileId) {
      throw new Error(`${this.constructor.name}:ngOnInit:  Ess File Id is not set`);
      return;
    }

    this.getDraft();
  }

  private getDraft() {
    this.supportService.supportsGetDraftSupports({ evacuationFileId: this.essFileId }).subscribe({
      next: (res) => {
        this.draftSupports = res;

        this.draftSupports.items.forEach((support) => {
          switch (support.type) {
            case SelfServeSupportType.ShelterAllowance:
              this.createSelfServeShelterAllowanceSupportForm(support as any);
              break;

            case SelfServeSupportType.FoodGroceries:
              this.createSelfServeFoodGroceriesSupportForm(support as any);
              break;

            case SelfServeSupportType.FoodRestaurant:
              this.createSelfServeFoodRestaurantSupportForm(support as any);
              break;
            case SelfServeSupportType.Clothing:
              this.createSelfServeClothingSupportForm(support as any);
              break;

            case SelfServeSupportType.Incidentals:
              this.createSelfServeIncidentsSupportForm(support as any);
              break;

            default:
              break;
          }
        });
      },
      error: (err) => {
        this.draftSupportError = true;
      },
      complete: () => {
        this.isLoadingDraftSupport = false;
      }
    });
  }

  private createSelfServeShelterAllowanceSupportForm(selfServeSupport: SelfServeShelterAllowanceSupport) {
    const dates = selfServeSupport.nights.map((n) => moment(n.date, 'YYYY-MM-DD'));
    const persons = selfServeSupport.nights[0].includedHouseholdMembers;

    this.createSupportPersonDateForm(this.supportDraftForm.controls.shelterAllowance.controls.nights, persons, dates);

    this.shelterAllowanceDates = [...dates];
    this.showSelfServeShelterAllowanceSupport = true;
  }

  private createSelfServeFoodGroceriesSupportForm(selfServeSupport: SelfServeFoodGroceriesSupport) {
    const dates = selfServeSupport.nights.map((n) => moment(n.date, 'YYYY-MM-DD'));
    const persons = selfServeSupport.nights[0].includedHouseholdMembers;

    this.createSupportPersonDateForm(
      this.supportDraftForm.controls.food.controls.groceries.controls.nights,
      persons,
      dates
    );

    this.foodGroceriesDates = [...dates];
    this.showSelfServeFoodSupport = true;
  }

  private createSelfServeFoodRestaurantSupportForm(selfServeSupport: SelfServeFoodRestaurantSupport) {
    const dates = selfServeSupport.meals.map((m) => moment(m.date, 'YYYY-MM-DD'));
    selfServeSupport.includedHouseholdMembers.forEach((p) => {
      this.supportDraftForm.controls.food.controls.restaurant.controls.includedHouseholdMembers.push(
        this.createSupportPersonForm(p)
      );
    });

    selfServeSupport.meals.forEach((m) => {
      this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.push(
        new FormGroup<SelfServeSupportDayMealForm>({
          date: new FormControl(moment(m.date, 'YYYY-MM-DD')),
          breakfast: new FormControl({ value: m.breakfast, disabled: m.breakfast !== true && m.breakfast !== false }),
          lunch: new FormControl({ value: m.lunch, disabled: m.lunch !== true && m.lunch !== false }),
          dinner: new FormControl({ value: m.dinner, disabled: m.dinner !== true && m.dinner !== false })
        })
      );
    });

    this.supportDraftForm.controls.food.controls.restaurant.controls.includedHouseholdMembers.valueChanges.subscribe({
      next: (includedHouseholdMembers) => {
        if (includedHouseholdMembers.every((m) => !m.isSelected)) {
          this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.controls.forEach((m) => {
            if (m.controls.breakfast.value === true) m.controls.breakfast.setValue(false);
            if (m.controls.lunch.value === true) m.controls.lunch.setValue(false);
            if (m.controls.dinner.value === true) m.controls.dinner.setValue(false);
          });
        }
      }
    });

    this.foodRestaurantDates = [...dates];

    this.showSelfServeShelterAllowanceSupport = true;
  }

  private createSelfServeClothingSupportForm(selfServeSupport: SelfServeClothingSupport) {
    selfServeSupport.includedHouseholdMembers.forEach((p) => {
      this.supportDraftForm.controls.clothing.controls.includedHouseholdMembers.push(this.createSupportPersonForm(p));
    });

    this.showSelfServeClothingSupport = true;
  }

  private createSelfServeIncidentsSupportForm(selfServeSupport: SelfServeIncidentalsSupport) {
    selfServeSupport.includedHouseholdMembers.forEach((p) => {
      this.supportDraftForm.controls.incidents.controls.includedHouseholdMembers.push(this.createSupportPersonForm(p));
    });

    this.showSelfServeIncidentsSupport = true;
  }

  createSupportPersonForm(id: string, isSelected: boolean = true): FormGroup<SupportPersonForm> {
    return new FormGroup<SupportPersonForm>({ personId: new FormControl(id), isSelected: new FormControl(isSelected) });
  }

  createSupportPersonDateForm(
    formArray: FormArray<FormGroup<SupportPersonDateForm>>,
    perons: string[],
    dates: moment.Moment[]
  ) {
    perons.forEach((p) => {
      dates.forEach((d) => {
        formArray.push(
          new FormGroup<SupportPersonDateForm>({
            personId: new FormControl(p),
            isSelected: new FormControl(true),
            date: new FormControl(d)
          })
        );
      });
    });
  }

  getPersonName(id: string) {
    const personDetails = this.draftSupports.householdMembers.find((p) => p.id == id)?.details;
    return `${personDetails?.firstName ?? ''} ${personDetails?.lastName ?? ''}`;
  }

  getDateControl(
    supportPersonDateForm: FormArray<FormGroup<SupportPersonDateForm>>,
    person: HouseholdMember,
    date: moment.Moment
  ): FormGroup<SupportPersonDateForm> {
    const personFormGroup = supportPersonDateForm.controls.find(
      (p: FormGroup) => p.controls.personId.value === person.id && p.controls.date.value === date
    );

    return personFormGroup;
  }

  gotoETransfterStep(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    if (!this.essFileId || formGroup.invalid) return;
    this.calculateSelfServeSupportsTotalAmount().subscribe((res) => {
      if (res.every((s) => s.totalAmount === 0))
        this.dialog.open(EligibleSelfServeTotalAmountZeroDialogComponent, {}).afterClosed().subscribe();
      else this.stepper.next();
    });
  }

  processShelterAllowanceData(): SelfServeShelterAllowanceSupport | null {
    const supportFormValue = this.supportDraftForm.value.shelterAllowance;

    const data: SelfServeShelterAllowanceSupport = {
      type: SelfServeSupportType.ShelterAllowance,
      totalAmount: supportFormValue.totalAmount
    };

    const datesWithMembers: Record<string, SupportDay> = this.getSupportDays(
      this.supportDraftForm.controls.shelterAllowance.controls.nights
    );

    data.nights = Object.values(datesWithMembers);

    return data;
  }

  processFoodData(): SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | null {
    const supportFormValue = this.supportDraftForm.value.food;

    if (supportFormValue.fundsFor === SupportSubCategory.FoodGroceries) {
      const data: SelfServeFoodGroceriesSupport = {
        type: SelfServeSupportType.FoodGroceries,
        totalAmount: 34
      };

      const supportDays: Record<string, SupportDay> = this.getSupportDays(
        this.supportDraftForm.controls.food.controls.groceries.controls.nights
      );

      data.nights = Object.values(supportDays);

      return data;
    } else if (supportFormValue.fundsFor === SupportSubCategory.FoodRestaurant) {
      const data: SelfServeFoodRestaurantSupport = {
        type: SelfServeSupportType.FoodRestaurant,
        totalAmount: 234,
        includedHouseholdMembers: [],
        meals: []
      };

      data.includedHouseholdMembers = supportFormValue.restaurant.includedHouseholdMembers
        .filter((p) => p.isSelected)
        .map((p) => p.personId);

      data.meals = supportFormValue.restaurant.mealTypes
        .filter((m) => m.breakfast || m.lunch || m.dinner)
        .map((m) => ({
          breakfast: m.breakfast,
          lunch: m.lunch,
          dinner: m.dinner,
          date: m.date.format('YYYY-MM-DD')
        }));

      return data;
    }

    return null;
  }

  processClothing() {
    const supportFormValue = this.supportDraftForm.value.clothing;
    const data: SelfServeClothingSupport = {
      type: SelfServeSupportType.Clothing,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportFormValue.includedHouseholdMembers
      .filter((m) => m.isSelected)
      .map((m) => m.personId);

    return data;
  }

  processIncidents() {
    const supportFormValue = this.supportDraftForm.value.incidents;
    const data: SelfServeIncidentalsSupport = {
      type: SelfServeSupportType.Incidentals,
      totalAmount: supportFormValue.totalAmount
    };

    data.includedHouseholdMembers = supportFormValue.includedHouseholdMembers
      .filter((m) => m.isSelected)
      .map((m) => m.personId);

    return data;
  }

  private getSupportDays(supportDays: FormArray<FormGroup<SupportPersonDateForm>>) {
    const datesWithMembers: Record<string, SupportDay> = {};
    supportDays.value.map((s) => {
      if (s.isSelected) {
        if (!datesWithMembers[s.date.toISOString()])
          datesWithMembers[s.date.toISOString()] = {
            date: s.date.toISOString(),
            includedHouseholdMembers: [s.personId]
          };
        else datesWithMembers[s.date.toISOString()].includedHouseholdMembers.push(s.personId);
      }
    });
    return datesWithMembers;
  }

  getPayloadData() {
    this.supportDraftForm.markAllAsTouched();

    const selfServeSupportRequest: SubmitSupportsRequest = {
      supports: []
    };

    if (this.showSelfServeShelterAllowanceSupport) {
      const processShelterAllowance = this.processShelterAllowanceData();
      if (processShelterAllowance) selfServeSupportRequest.supports.push(processShelterAllowance);
    }

    if (this.showSelfServeFoodSupport) {
      const processFood = this.processFoodData();
      if (processFood) selfServeSupportRequest.supports.push(processFood);
    }

    if (this.showSelfServeClothingSupport) {
      const processClothing = this.processClothing();
      if (processClothing) selfServeSupportRequest.supports.push(processClothing);
    }

    if (this.showSelfServeIncidentsSupport) {
      const processIncidents = this.processIncidents();
      if (processIncidents) selfServeSupportRequest.supports.push(processIncidents);
    }

    console.log('getTotals: Payload:', selfServeSupportRequest);

    return selfServeSupportRequest;
  }

  calculateSelfServeSupportsTotalAmount() {
    const selfServeRequestPayload = this.getPayloadData();
    this.showButtonLoader = true;
    return this.supportService
      .supportsCalculateAmounts({
        evacuationFileId: this.essFileId,
        body: selfServeRequestPayload.supports
      })
      .pipe(tap(() => (this.showButtonLoader = false)));
  }

  submit() {
    const selfServeRequestPayload = this.getPayloadData();
  }

  gotoEligibilityConfirmation() {
    this.router.navigate(['../confirm'], { relativeTo: this.route });
  }
}
