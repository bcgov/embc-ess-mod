import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Injectable({ providedIn: 'root' })
export class SupportDetailsService {
  constructor(
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
  ) {}

  generateDynamicForm(supportType: string): FormGroup {
    console.log(supportType);
    if (supportType === 'Food') {
      return this.mealForm();
    } else if (supportType === 'Groceries') {
      return this.groceriesForm();
    } else if (supportType === 'Taxi') {
      return this.taxiForm();
    } else if (supportType === 'Other') {
      return this.otherTransportForm();
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
}
