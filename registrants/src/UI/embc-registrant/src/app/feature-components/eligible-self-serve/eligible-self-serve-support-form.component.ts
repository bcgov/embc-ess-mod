import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import * as moment from 'moment';
import {
  SelfServeFoodGroceriesSupport,
  SelfServeFoodRestaurantSupport,
  SelfServeShelterAllowanceSupport,
  SubmitSupportsRequest,
  SupportSubCategory
} from 'src/app/core/api/models';
import { SupportsService } from 'src/app/core/api/services';

interface Person {
  id: string;
  name: string;
}

interface SupportDateForm {
  date: FormControl<moment.Moment>;
  isRequired?: FormControl<boolean>;
}

interface SupportPersonForm {
  personId: FormControl<string>;
  isSelected?: FormControl<boolean>;
}

type SupportDateFormArray = FormArray<FormGroup<SupportDateForm>>;

interface SupportPersonFormWithDates extends SupportPersonForm {
  supportDates?: SupportDateFormArray;
}

interface SupportDateFormWthMealType extends SupportDateForm {
  breakfast: FormControl<boolean>;
  lunch: FormControl<boolean>;
  dinner: FormControl<boolean>;
}

type FundsFor = SupportSubCategory.Food_Groceries | SupportSubCategory.Food_Restaurant | null;

interface RestaurantForm {
  persons: FormArray<FormGroup<SupportPersonForm>>;
  mealTypes: FormArray<FormGroup<SupportDateFormWthMealType>>;
}

interface FoodForm {
  fundsFor: FormControl<FundsFor>;
  restaurant: FormGroup<RestaurantForm>;
  groceries: FormArray<FormGroup<SupportPersonFormWithDates>>;
}

interface SupportDraftForm {
  shelterAllowance: FormArray<FormGroup<SupportPersonFormWithDates>>;
  food: FormGroup<FoodForm>;
  clothing: FormArray<FormGroup<SupportPersonForm>>;
  incidents: FormArray<FormGroup<SupportPersonForm>>;
}

@Component({
  standalone: true,
  selector: 'app-eligible-self-serve-support-form',
  templateUrl: './eligible-self-serve-support-form.component.html',
  imports: [MatStepperModule, MatCardModule, MatCheckboxModule, MatRadioModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      mat-card {
        margin-bottom: var(--size-3);
      }

      .mat-mdc-card-content,
      .mat-mdc-card-content:first-child,
      .mat-mdc-card-content:last-child {
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
        min-width: 350px;
        height: min-content;
        padding: var(--size-2);
      }
    `
  ]
})
export class EligibleSelfServeSupportFormComponent implements OnInit {
  isLinear = false;
  SupportSubCategory = SupportSubCategory;
  supportRequiredDates = [moment(), moment().add(1, 'day'), moment().add(2, 'day')];

  supportDraftForm = new FormGroup<SupportDraftForm>({
    shelterAllowance: new FormArray<FormGroup<SupportPersonFormWithDates>>([]),
    food: new FormGroup<FoodForm>({
      fundsFor: new FormControl<FundsFor>(null, Validators.required),
      restaurant: new FormGroup<RestaurantForm>({
        persons: new FormArray([]),
        mealTypes: new FormArray([])
      }),
      groceries: new FormArray<FormGroup<SupportPersonFormWithDates>>([])
    }),
    clothing: new FormArray<FormGroup<SupportPersonForm>>([]),
    incidents: new FormArray<FormGroup<SupportPersonForm>>([])
  });

  eTransferForm: FormGroup;

  persons = [];

  constructor(
    private _formBuilder: FormBuilder,
    private supportService: SupportsService
  ) {}

  ngOnInit() {
    this.eTransferForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    //
    this.getDraft();
  }

  createSupportDraftForm(persons: Person[]) {
    persons.forEach((p) => {
      this.supportDraftForm.controls.shelterAllowance.push(this.createSupportPersonFormWithDates(p.id));
      this.supportDraftForm.controls.food.controls.groceries.push(this.createSupportPersonFormWithDates(p.id));
      this.supportDraftForm.controls.food.controls.restaurant.controls.persons.push(this.createSupportPersonForm(p.id));

      this.supportDraftForm.controls.clothing.push(this.createSupportPersonForm(p.id));
      this.supportDraftForm.controls.incidents.push(this.createSupportPersonForm(p.id));
    });

    this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes = this.createMealTypesForm();
  }

  createSupportDateForm(date: moment.Moment): FormGroup<SupportDateForm> {
    return new FormGroup<SupportDateForm>({ date: new FormControl(date), isRequired: new FormControl(true) });
  }

  createSupportPersonForm(id: string): FormGroup<SupportPersonForm> {
    return new FormGroup<SupportPersonForm>({ personId: new FormControl(id), isSelected: new FormControl() });
  }

  createSupportDatesFormArray(): SupportDateFormArray {
    return new FormArray([...this.supportRequiredDates.map((date) => this.createSupportDateForm(date))]);
  }

  createMealTypesForm(): FormArray<FormGroup<SupportDateFormWthMealType>> {
    return new FormArray([
      ...this.supportRequiredDates.map(
        (date) =>
          new FormGroup<SupportDateFormWthMealType>({
            date: new FormControl(date),
            breakfast: new FormControl(false),
            lunch: new FormControl(false),
            dinner: new FormControl(false)
          })
      )
    ]);
  }

  createSupportPersonFormWithDates(id: string): FormGroup<SupportPersonFormWithDates> {
    return new FormGroup<SupportPersonFormWithDates>({
      personId: new FormControl(id),
      isSelected: new FormControl(),
      supportDates: this.createSupportDatesFormArray()
    });
  }

  getPersonName(id: string) {
    return this.persons.find((p) => p.id == id).name;
  }

  getDateControl(
    supportPersonFormWithDates: FormArray<FormGroup<SupportPersonFormWithDates>>,
    person: Person,
    date: moment.Moment
  ) {
    const personFormGroup = supportPersonFormWithDates.controls.find(
      (p: FormGroup) => p.controls.personId.value === person.id
    );
    return personFormGroup.controls.supportDates.controls.find(
      (dateFormGroup) => dateFormGroup.controls.date.value === date
    ).controls.isRequired;
  }

  getDraft() {
    // this.supportService.supportsGetDraftSupports({ fileReferenceNumber: 'test' }).subscribe((res) => {
    // console.log('supportsGetDraftSupports:', res);
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
    this.createSupportDraftForm(persons);
    this.persons = persons;
    // });
  }

  processShelterAllowanceData(): SelfServeShelterAllowanceSupport | null {
    const shelterAllowanceFormValue = this.supportDraftForm.value.shelterAllowance;

    const data: SelfServeShelterAllowanceSupport = {
      $type: 'shelter',
      totalAmount: 2342
    };

    const datesWithMembers = {};
    shelterAllowanceFormValue.forEach((p) => {
      p.supportDates.forEach((d) => {
        if (d.isRequired) {
          if (!datesWithMembers[d.date.toISOString()]) datesWithMembers[d.date.toISOString()] = [];
          datesWithMembers[d.date.toISOString()].push(p.personId);
        }
      });
    });

    if (Object.keys(datesWithMembers).length === 0) return null;

    data.nights = Object.entries(datesWithMembers).map(([date, includedHouseholdMembers]) => ({
      date,
      includedHouseholdMembers: includedHouseholdMembers as string[]
    }));

    return data;
  }

  processFoodData(): SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | null {
    const foodData = this.supportDraftForm.value.food;

    if (foodData.fundsFor === SupportSubCategory.Food_Groceries) {
      const data: SelfServeFoodGroceriesSupport = { $type: 'food', totalAmount: 34, nights: [] }; // @TODO:
      const datesWithMembers = {};
      foodData.groceries.map((p) => {
        p.supportDates.forEach((d) => {
          if (d.isRequired) {
            if (!datesWithMembers[d.date.toISOString()]) datesWithMembers[d.date.toISOString()] = [];
            datesWithMembers[d.date.toISOString()].push(p.personId);
          }
        });
      });

      if (Object.keys(datesWithMembers).length === 0) return null;

      data.nights = Object.entries(datesWithMembers).map(([date, includedHouseholdMembers]) => ({
        date,
        includedHouseholdMembers: includedHouseholdMembers as string[]
      }));

      return data;
    } else if (foodData.fundsFor === SupportSubCategory.Food_Restaurant) {
      const data: SelfServeFoodRestaurantSupport = {
        $type: 'restaurant',
        totalAmount: 234,
        includedHouseholdMembers: [],
        meals: []
      };

      data.includedHouseholdMembers = foodData.restaurant.persons.filter((p) => p.isSelected).map((p) => p.personId);
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
