import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import * as moment from 'moment';
import { SupportSubCategory } from 'src/app/core/api/models';
import { SupportsService } from 'src/app/core/api/services';

interface Person {
  id: string;
  name: string;
}

interface SupportDateForm {
  date: FormControl<moment.Moment>;
  isRequired: FormControl<boolean>;
}

interface SupportPersonForm {
  personId: FormControl<string>;
  isSelected?: FormControl<boolean>;
}

type SupportDateFormArray = FormArray<FormGroup<SupportDateForm>>;

interface SupportPersonFormWithDates extends SupportPersonForm {
  supportDates?: SupportDateFormArray;
}

interface FoodRestaurantMealTypeForm {
  breakfast: SupportDateFormArray;
  lunch: SupportDateFormArray;
  dinner: SupportDateFormArray;
}

type FundsFor = SupportSubCategory.Food_Groceries | SupportSubCategory.Food_Restaurant | null;

interface RestaurantForm {
  persons: FormArray<FormGroup<SupportPersonForm>>;
  mealTypes: FormGroup<FoodRestaurantMealTypeForm>;
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
    `
  ]
})
export class EligibleSelfServeSupportForm implements OnInit {
  isLinear = false;
  SupportSubCategory = SupportSubCategory;
  supportRequiredDates = [moment(), moment().add(1, 'day'), moment().add(2, 'day')];

  supportDraftForm = new FormGroup<SupportDraftForm>({
    shelterAllowance: new FormArray<FormGroup<SupportPersonFormWithDates>>([]),
    food: new FormGroup<FoodForm>({
      fundsFor: new FormControl<FundsFor>(null),
      restaurant: new FormGroup<RestaurantForm>({
        persons: new FormArray([]),
        mealTypes: new FormGroup({
          breakfast: new FormArray([]),
          lunch: new FormArray([]),
          dinner: new FormArray([])
        })
      }),
      groceries: new FormArray<FormGroup<SupportPersonFormWithDates>>([])
    }),
    clothing: new FormArray<FormGroup<SupportPersonForm>>([]),
    incidents: new FormArray<FormGroup<SupportPersonForm>>([])
  });

  eTransferForm: FormGroup;

  persons = [
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

  constructor(
    private _formBuilder: FormBuilder,
    private supportService: SupportsService
  ) {}

  ngOnInit() {
    // Get no.of persons
    this.persons.forEach((p) => {
      this.supportDraftForm.controls.shelterAllowance.push(this.createSupportPersonFormWithDates(p.id));
      this.supportDraftForm.controls.food.controls.groceries.push(this.createSupportPersonFormWithDates(p.id));
      this.supportDraftForm.controls.food.controls.restaurant.controls.persons.push(this.createSupportPersonForm(p.id));

      this.supportDraftForm.controls.clothing.push(this.createSupportPersonForm(p.id));
      this.supportDraftForm.controls.incidents.push(this.createSupportPersonForm(p.id));
    });

    this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.controls.breakfast =
      this.createSupportDatesFormArray();
    this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.controls.lunch =
      this.createSupportDatesFormArray();
    this.supportDraftForm.controls.food.controls.restaurant.controls.mealTypes.controls.dinner =
      this.createSupportDatesFormArray();

    console.log('FormArray:', this.supportDraftForm);

    this.eTransferForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    //
    this.getDraft();
  }

  createSupportDateForm(date: moment.Moment): FormGroup<SupportDateForm> {
    return new FormGroup({ date: new FormControl(date), isRequired: new FormControl(true) });
  }

  createSupportPersonForm(id: string): FormGroup<SupportPersonForm> {
    return new FormGroup<SupportPersonForm>({ personId: new FormControl(id), isSelected: new FormControl() });
  }

  createSupportDatesFormArray(): SupportDateFormArray {
    return new FormArray([...this.supportRequiredDates.map((date) => this.createSupportDateForm(date))]);
  }

  createMealTypesForm(): FormGroup<FoodRestaurantMealTypeForm> {
    return new FormGroup<FoodRestaurantMealTypeForm>({
      breakfast: this.createSupportDatesFormArray(),
      lunch: this.createSupportDatesFormArray(),
      dinner: this.createSupportDatesFormArray()
    });
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
    //   console.log('supportsGetDraftSupports:', res);
    // });
  }
}
