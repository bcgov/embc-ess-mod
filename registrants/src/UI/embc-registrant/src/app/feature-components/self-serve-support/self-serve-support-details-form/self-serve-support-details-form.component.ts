import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  DraftSupportForm,
  SelfServeSupportDayMealForm,
  SupportPersonDateForm,
  SupportPersonForm
} from '../self-serve-support.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DraftSupports,
  HouseholdMember,
  SelfServeClothingSupport,
  SelfServeFoodGroceriesSupport,
  SelfServeFoodRestaurantSupport,
  SelfServeIncidentalsSupport,
  SelfServeShelterAllowanceSupport,
  SelfServeSupportType
} from 'src/app/core/api/models';
import * as moment from 'moment';

@Component({
  selector: 'app-self-serve-support-details-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatCardModule, MatRadioModule, MatFormFieldModule],
  templateUrl: './self-serve-support-details-form.component.html',
  styleUrls: ['../self-serve-support-form.component.scss', './self-serve-support-details-form.component.scss']
})
export class SelfServeSupportDetailsFormComponent {
  SelfServeSupportType = SelfServeSupportType;
  @Input() supportDraftForm: FormGroup<DraftSupportForm>;

  showSelfServeShelterAllowanceSupport = false;
  showSelfServeFoodSupport = false;
  showSelfServeClothingSupport = false;
  showSelfServeIncidentsSupport = false;

  shelterAllowanceDates: moment.Moment[] = [];
  foodGroceriesDates: moment.Moment[] = [];
  foodRestaurantDates: moment.Moment[] = [];

  _draftSupports: DraftSupports;

  @Input()
  set draftSupports(draftSupports: DraftSupports) {
    draftSupports.items.forEach((support) => {
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

    this._draftSupports = draftSupports;
  }

  get draftSupports() {
    return this._draftSupports;
  }

  private createSelfServeShelterAllowanceSupportForm(selfServeSupport: SelfServeShelterAllowanceSupport) {
    const dates = selfServeSupport.nights.map((n) => moment(n.date, 'YYYY-MM-DD'));
    const persons = selfServeSupport.nights[0].includedHouseholdMembers;

    this.createSupportPersonDateForm(this.supportDraftForm.controls.shelterAllowance.controls.nights, persons, dates);

    this.supportDraftForm.controls.shelterAllowance.controls.totalAmount.setValue(selfServeSupport.totalAmount ?? 0);

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

    this.supportDraftForm.controls.food.controls.groceries.controls.totalAmount.setValue(
      selfServeSupport.totalAmount ?? 0
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

    this.supportDraftForm.controls.food.controls.restaurant.controls.totalAmount.setValue(
      selfServeSupport.totalAmount ?? 0
    );

    this.foodRestaurantDates = [...dates];

    this.showSelfServeFoodSupport = true;
  }

  private createSelfServeClothingSupportForm(selfServeSupport: SelfServeClothingSupport) {
    selfServeSupport.includedHouseholdMembers.forEach((p) => {
      this.supportDraftForm.controls.clothing.controls.includedHouseholdMembers.push(this.createSupportPersonForm(p));
    });

    this.supportDraftForm.controls.clothing.controls.totalAmount.setValue(selfServeSupport.totalAmount ?? 0);

    this.showSelfServeClothingSupport = true;
  }

  private createSelfServeIncidentsSupportForm(selfServeSupport: SelfServeIncidentalsSupport) {
    selfServeSupport.includedHouseholdMembers.forEach((p) => {
      this.supportDraftForm.controls.incidents.controls.includedHouseholdMembers.push(this.createSupportPersonForm(p));
    });

    this.supportDraftForm.controls.incidents.controls.totalAmount.setValue(selfServeSupport.totalAmount ?? 0);

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
    return `${personDetails?.firstName ?? ''}`;
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
}
