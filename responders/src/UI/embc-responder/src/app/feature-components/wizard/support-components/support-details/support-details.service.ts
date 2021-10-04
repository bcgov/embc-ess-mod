import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportCategory, SupportSubCategory } from 'src/app/core/api/models';
import {
  Billeting,
  Clothing,
  Groceries,
  GroupLodging,
  HotelMotel,
  Incidentals,
  OtherTransport,
  RestaurantMeal,
  Taxi
} from 'src/app/core/models/support-details.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Injectable({ providedIn: 'root' })
export class SupportDetailsService {
  constructor(
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    public stepSupportsService: StepSupportsService
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
      noOfBreakfast: [
        (this.stepSupportsService?.supportDetails?.referral as RestaurantMeal)
          ?.noOfBreakfast ?? '',
        [Validators.required]
      ],
      noOfLunches: [
        (this.stepSupportsService?.supportDetails?.referral as RestaurantMeal)
          ?.noOfLunches ?? '',
        [Validators.required]
      ],
      noOfDinners: [
        (this.stepSupportsService?.supportDetails?.referral as RestaurantMeal)
          ?.noOfDinners ?? '',
        [Validators.required]
      ],
      totalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as RestaurantMeal)
          ?.totalAmount ?? ''
      ]
    });
  }

  groceriesForm(): FormGroup {
    return this.formBuilder.group({
      noOfMeals: [
        (this.stepSupportsService?.supportDetails?.referral as Groceries)
          ?.noOfMeals ?? '',
        [Validators.required]
      ],
      totalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Groceries)
          ?.totalAmount ?? ''
      ],
      userTotalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Groceries)
          ?.userTotalAmount ?? ''
      ]
    });
  }

  taxiForm(): FormGroup {
    return this.formBuilder.group({
      fromAddress: [
        (this.stepSupportsService?.supportDetails?.referral as Taxi)
          ?.fromAddress ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      toAddress: [
        (this.stepSupportsService?.supportDetails?.referral as Taxi)
          ?.toAddress ?? '',
        [this.customValidation.whitespaceValidator()]
      ]
    });
  }

  otherTransportForm(): FormGroup {
    return this.formBuilder.group({
      transportMode: [
        (this.stepSupportsService?.supportDetails?.referral as OtherTransport)
          ?.transportMode ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      totalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as OtherTransport)
          ?.totalAmount ?? '',
        [Validators.required]
      ]
    });
  }

  hotelMotelForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: [
        (this.stepSupportsService?.supportDetails?.referral as HotelMotel)
          ?.noOfNights ?? '',
        [Validators.required]
      ],
      noOfRooms: [
        (this.stepSupportsService?.supportDetails?.referral as HotelMotel)
          ?.noOfRooms ?? '',
        [Validators.required]
      ]
    });
  }

  billetingForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: [
        (this.stepSupportsService?.supportDetails?.referral as Billeting)
          ?.noOfNights ?? '',
        [Validators.required]
      ]
    });
  }

  groupLodgingForm(): FormGroup {
    return this.formBuilder.group({
      noOfNights: [
        (this.stepSupportsService?.supportDetails?.referral as GroupLodging)
          ?.noOfNights ?? '',
        [Validators.required]
      ]
    });
  }

  incidentalsForm(): FormGroup {
    return this.formBuilder.group({
      approvedItems: [
        (this.stepSupportsService?.supportDetails?.referral as Incidentals)
          ?.approvedItems ?? '',
        [this.customValidation.whitespaceValidator()]
      ],
      totalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Incidentals)
          ?.totalAmount ?? '',
        [Validators.required]
      ],
      userTotalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Incidentals)
          ?.totalAmount ?? ''
      ]
    });
  }

  clothingForm(): FormGroup {
    return this.formBuilder.group({
      extremeWinterConditions: [
        (this.stepSupportsService?.supportDetails?.referral as Clothing)
          ?.extremeWinterConditions ?? null,
        [Validators.required]
      ],
      totalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Clothing)
          ?.totalAmount ?? '',
        [Validators.required]
      ],
      userTotalAmount: [
        (this.stepSupportsService?.supportDetails?.referral as Clothing)
          ?.totalAmount ?? ''
      ]
    });
  }
}
