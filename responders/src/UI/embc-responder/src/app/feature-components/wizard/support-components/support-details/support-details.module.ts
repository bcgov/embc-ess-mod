import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SupportDetailsRoutingModule } from './support-details-routing.module';
import { SupportDetailsComponent } from './support-details.component';

import { OverrideDatetimeComponent } from './override-datetime/override-datetime.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FoodMealsComponent } from './details-type/food-meals/food-meals.component';

import { FoodGroceriesComponent } from './details-type/food-groceries/food-groceries.component';
import { TaxiTransportationComponent } from './details-type/taxi-transportation/taxi-transportation.component';
import { OtherTransportationComponent } from './details-type/other-transportation/other-transportation.component';
import { LodgingHotelMotelComponent } from './details-type/lodging-hotel-motel/lodging-hotel-motel.component';
import { LodgingBilletingComponent } from './details-type/lodging-billeting/lodging-billeting.component';
import { LodgingGroupComponent } from './details-type/lodging-group/lodging-group.component';
import { ClothingComponent } from './details-type/clothing/clothing.component';
import { IncidentalsComponent } from './details-type/incidentals/incidentals.component';
import { CustomDirectiveModule } from 'src/app/shared/directives/customDirective.module';

import { ShelterAllowanceGroupComponent } from './details-type/shelter-allowance/shelter-allowance.component';

@NgModule({
  imports: [
    CommonModule,
    SupportDetailsRoutingModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    SupportDetailsComponent,
    OverrideDatetimeComponent,
    FoodMealsComponent,
    FoodGroceriesComponent,
    TaxiTransportationComponent,
    OtherTransportationComponent,
    LodgingHotelMotelComponent,
    LodgingBilletingComponent,
    LodgingGroupComponent,
    ClothingComponent,
    IncidentalsComponent,
    ShelterAllowanceGroupComponent
  ],
  providers: [DatePipe]
})
export class SupportDetailsModule {}
