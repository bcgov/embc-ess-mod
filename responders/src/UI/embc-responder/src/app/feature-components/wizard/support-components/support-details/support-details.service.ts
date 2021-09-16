import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportCategory, SupportSubCategory } from 'src/app/core/api/models';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Injectable({ providedIn: 'root' })
export class SupportDetailsService {
  constructor(
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  generateDynamicForm(supportType: string): FormGroup {
    console.log(supportType);
    if (supportType === SupportSubCategory.Food_Restaurant) {
      return this.mealForm();
    } else if (supportType === SupportSubCategory.Food_Groceries) {
      return this.groceriesForm();
    } else if (supportType === SupportSubCategory.Transportation_Taxi) {
      return this.taxiForm();
    } else if (supportType === SupportSubCategory.Transportation_Other) {
      return this.otherTransportForm();
    } else if (supportType === SupportSubCategory.Lodging_Hotel) {
      return this.hotelMotelForm();
    } else if (supportType === SupportSubCategory.Lodging_Billeting) {
      return this.billetingForm();
    } else if (supportType === SupportSubCategory.Lodging_Group) {
      return this.groupLodgingForm();
    } else if (supportType === SupportCategory.Incidentals) {
      return this.incidentalsForm();
    } else if (supportType === SupportCategory.Clothing) {
      return this.clothingForm();
    }
  }

  mealForm(): FormGroup {
    return this.formBuilder.group({
      noOfBreakfast: ['', [Validators.required]],
      noOfLunches: ['', [Validators.required]],
      noOfDinners: ['', [Validators.required]],
      totalAmount: ['']
    });
  }

  groceriesForm(): FormGroup {
    return this.formBuilder.group({
      noOfMeals: ['', [Validators.required]],
      totalAmount: [''],
      userTotalAmount: ['']
    });
  }

  taxiForm(): FormGroup {
    return this.formBuilder.group({
      fromAddress: ['', [this.customValidation.whitespaceValidator()]],
      toAddress: ['', [this.customValidation.whitespaceValidator()]]
    });
  }

  otherTransportForm(): FormGroup {
    return this.formBuilder.group({
      transportMode: ['', [this.customValidation.whitespaceValidator()]],
      totalAmount: ['', [Validators.required]]
    });
  }

  hotelMotelForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: ['', [Validators.required]],
      noOfRooms: ['', [Validators.required]]
    });
  }

  billetingForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: ['', [Validators.required]]
    });
  }

  groupLodgingForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: ['', [Validators.required]]
    });
  }

  incidentalsForm(): FormGroup {
    return this.formBuilder.group({
      approvedItems: ['', [this.customValidation.whitespaceValidator()]],
      totalAmount: ['', [Validators.required]],
      userTotalAmount: ['']
    });
  }

  clothingForm(): FormGroup {
    return this.formBuilder.group({
      extremeWinterConditions: [null, [Validators.required]],
      totalAmount: ['', [Validators.required]],
      userTotalAmount: ['']
    });
  }
}
