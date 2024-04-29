import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import * as moment from 'moment';
import {
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

type SelfServeSupportUnionType =
  | SelfServeShelterAllowanceSupport
  | SelfServeFoodGroceriesSupport
  | SelfServeFoodRestaurantSupport
  | SelfServeIncidentalsSupport
  | SelfServeClothingSupport;
interface Person {
  id: string;
  name: string;
}

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

interface SelfServeFoodRestaurantForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
  mealTypes: FormArray<FormGroup<SelfServeSupportDayMealForm>>;
}

interface FoodForm {
  fundsFor: FormControl<FundsFor>;
  restaurant: FormGroup<SelfServeFoodRestaurantForm>;
  groceries: FormArray<FormGroup<SupportPersonDateForm>>;
}

interface SelfServeShelerAllowanceForm extends BaseSelfServeSupportForm {
  nights: FormArray<FormGroup<SupportPersonDateForm>>;
}

interface SelfServeClothingSupportForm extends BaseSelfServeSupportForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
}
interface SelfServeIncidentsSupportForm extends BaseSelfServeSupportForm {
  includedHouseholdMembers: FormArray<FormGroup<SupportPersonForm>>;
}

interface SupportDraftForm {
  shelterAllowance: FormGroup<SelfServeShelerAllowanceForm>;
  food: FormGroup<FoodForm>;
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
    MatInputModule
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
  supportRequiredDates = [];
  persons = [];

  supportDraftForm = new FormGroup<SupportDraftForm>({
    shelterAllowance: new FormGroup<SelfServeShelerAllowanceForm>({
      totalAmount: new FormControl<number>(0),
      nights: new FormArray<FormGroup<SupportPersonDateForm>>([])
    }),
    food: new FormGroup<FoodForm>({
      fundsFor: new FormControl<FundsFor>(null, Validators.required),
      restaurant: new FormGroup<SelfServeFoodRestaurantForm>({
        includedHouseholdMembers: new FormArray([]),
        mealTypes: new FormArray([])
      }),
      groceries: new FormArray<FormGroup<SupportPersonDateForm>>([])
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
    private evacuationFileDateService: EvacuationFileDataService,
    public needsAssessmentService: NeedsAssessmentService
  ) {}

  ngOnInit() {
    if (!this.essFileId) {
      throw new Error(`${this.constructor.name}:ngOnInit:  Ess File Id is not set`);
      return;
    }

    this.getDraft();
  }

  createSupportDraftForm(persons: Person[], dates: moment.Moment[], selfServeSupports: SelfServeSupportUnionType[]) {
    const shelterAllowanceSupport = selfServeSupports.find(
      (s) => s.type === SelfServeSupportType.ShelterAllowance
    ) as SelfServeShelterAllowanceSupport;
    this.createSupportPersonDateForm(
      this.supportDraftForm.controls.shelterAllowance.controls.nights,
      persons,
      dates,
      shelterAllowanceSupport.nights
    );

    const groceriesSupport = selfServeSupports.find(
      (s) => s.type === SelfServeSupportType.FoodGroceries
    ) as SelfServeFoodGroceriesSupport;

    this.createSupportPersonDateForm(
      this.supportDraftForm.controls.food.controls.groceries,
      persons,
      dates,
      groceriesSupport.nights
    );

    persons.forEach((p) => {
      this.supportDraftForm.controls.food.controls.restaurant.controls.includedHouseholdMembers.push(
        this.createSupportPersonForm(p.id)
      );

      this.supportDraftForm.controls.clothing.controls.includedHouseholdMembers.push(
        this.createSupportPersonForm(p.id)
      );
      this.supportDraftForm.controls.incidents.controls.includedHouseholdMembers.push(
        this.createSupportPersonForm(p.id)
      );
    });

    this.createMealTypesForm(dates);
  }

  createSupportPersonForm(id: string): FormGroup<SupportPersonForm> {
    return new FormGroup<SupportPersonForm>({ personId: new FormControl(id), isSelected: new FormControl() });
  }

  createMealTypesForm(dates: moment.Moment[]) {
    dates.forEach((date) => {
      this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.push(
        new FormGroup<SelfServeSupportDayMealForm>({
          date: new FormControl(date),
          breakfast: new FormControl(false),
          lunch: new FormControl(false),
          dinner: new FormControl(false)
        })
      );
    });
  }

  createSupportPersonDateForm(
    formArray: FormArray<FormGroup<SupportPersonDateForm>>,
    perons: Person[],
    dates: moment.Moment[],
    supportDays: SupportDay[]
  ) {
    perons.forEach((p) => {
      dates.forEach((d) => {
        const findSupportDay = supportDays?.find((s) => moment(s.date).format('mm/dd/yyyy') === d.format('mm/dd/yyyy'));

        formArray.push(
          new FormGroup<SupportPersonDateForm>({
            personId: new FormControl(p.id),
            isSelected: new FormControl(findSupportDay?.includedHouseholdMembers?.includes(p.id)),
            date: new FormControl(d)
          })
        );
      });
    });
  }

  getPersonName(id: string) {
    return this.persons.find((p) => p.id == id).name;
  }

  getDateControl(
    supportPersonDateForm: FormArray<FormGroup<SupportPersonDateForm>>,
    person: Person,
    date: moment.Moment
  ): FormGroup<SupportPersonDateForm> {
    const personFormGroup = supportPersonDateForm.controls.find(
      (p: FormGroup) => p.controls.personId.value === person.id && p.controls.date.value === date
    );

    return personFormGroup;
  }

  gotoNextStep(formGroup: FormGroup) {
    console.log(formGroup.value);
    formGroup.markAllAsTouched();
    if (!this.essFileId && formGroup.invalid) return;
    this.stepper.next();
  }

  getDraft() {
    // const essFile = this.evacuationFileDateService.createEvacuationFileDTO();
    // this.supportService.supportsGetDraftSupports({ evacuationFileId: fileId }).subscribe((res) => {
    const shelterAllowance = <SelfServeShelterAllowanceSupport>{
      type: SelfServeSupportType.ShelterAllowance,
      totalAmount: 223,
      nights: [
        {
          date: moment().toISOString(),
          includedHouseholdMembers: ['2']
        },
        {
          date: moment().add(1, 'day').toISOString(),
          includedHouseholdMembers: ['1', '2']
        }
      ]
    };

    // this.supportDraftForm.controls.shelterAllowance.setValue({});

    const foodGroceries = <SelfServeFoodGroceriesSupport>{
      type: SelfServeSupportType.FoodGroceries,
      nights: [
        {
          date: moment().add(2, 'day').toISOString(),
          includedHouseholdMembers: ['1', '2']
        }
      ],
      totalAmount: 345
    };

    const foodRestaurant = <SelfServeFoodRestaurantSupport>{
      type: SelfServeSupportType.FoodRestaurant,
      includedHouseholdMembers: ['1'],
      meals: [
        {
          breakfast: true,
          date: moment().toISOString(),
          lunch: false,
          dinner: true
        }
      ]
    };

    const selfServeSupports: SelfServeSupport[] = [shelterAllowance as any, foodGroceries as any];
    const persons = [
      {
        id: '1',
        name: 'Test person1 1'
      },
      {
        id: '2',
        name: 'Test Person2 2'
      },
      {
        id: '3',
        name: 'Test person 3'
      }
    ];
    const dates = [moment(), moment().add(1, 'day'), moment().add(2, 'day')];
    // this.evacuationFileDateService.createEvacuationFileDTO().needsAssessment.householdMembers;
    this.createSupportDraftForm(persons, dates, selfServeSupports);
    this.persons = persons;
    this.supportRequiredDates = [...dates];
    // });
  }

  processShelterAllowanceData(): SelfServeShelterAllowanceSupport | null {
    const shelterAllowanceFormValue = this.supportDraftForm.value.shelterAllowance;

    const data: SelfServeShelterAllowanceSupport = {
      // $type: 'shelter',
      totalAmount: 2342
    };

    const datesWithMembers: Record<string, SupportDay> = this.getSupportDays(
      this.supportDraftForm.controls.shelterAllowance.controls.nights
    );

    if (Object.keys(datesWithMembers).length === 0) return null;

    data.nights = Object.values(datesWithMembers);

    return data;
  }

  processFoodData(): SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | null {
    const foodData = this.supportDraftForm.value.food;

    if (foodData.fundsFor === SupportSubCategory.FoodGroceries) {
      const data: SelfServeFoodGroceriesSupport = {
        // $type: 'food',
        totalAmount: 34,
        nights: []
      }; // @TODO:
      const supportDays: Record<string, SupportDay> = this.getSupportDays(
        this.supportDraftForm.controls.food.controls.groceries
      );

      if (Object.keys(supportDays).length === 0) return null;

      data.nights = Object.values(supportDays);

      return data;
    } else if (foodData.fundsFor === SupportSubCategory.FoodRestaurant) {
      const data: SelfServeFoodRestaurantSupport = {
        // $type: 'restaurant',
        totalAmount: 234,
        includedHouseholdMembers: [],
        meals: []
      };

      data.includedHouseholdMembers = foodData.restaurant.includedHouseholdMembers
        .filter((p) => p.isSelected)
        .map((p) => p.personId);
      data.meals = foodData.restaurant.mealTypes
        .filter((m) => m.breakfast || m.lunch || m.dinner)
        .map((m) => ({
          breakfast: m.breakfast,
          lunch: m.lunch,
          dinner: m.dinner,
          date: m.date.toISOString()
        }));

      if (
        !data.includedHouseholdMembers ||
        data.includedHouseholdMembers?.length === 0 ||
        !data.meals ||
        data.meals?.length === 0
      )
        return null;

      return data;
    }

    return null;
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

  submit() {
    this.supportDraftForm.markAllAsTouched();

    const selfServeSupportRequest: SubmitSupportsRequest = {
      supports: []
    };

    const shelterSupportData = this.processShelterAllowanceData();
    const foodData = this.processFoodData();
    console.log(shelterSupportData, foodData);
  }
}
