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
}
