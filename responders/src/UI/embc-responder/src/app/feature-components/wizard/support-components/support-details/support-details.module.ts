import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SupportDetailsRoutingModule } from './support-details-routing.module';
import { SupportDetailsComponent } from './support-details.component';
import { MaterialModule } from 'src/app/material.module';
import { OverrideDatetimeComponent } from './override-datetime/override-datetime.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FoodMealsComponent } from './details-type/food-meals/food-meals.component';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';
import { FoodGroceriesComponent } from './details-type/food-groceries/food-groceries.component';
import { TaxiTransportationComponent } from './details-type/taxi-transportation/taxi-transportation.component';
import { OtherTransportationComponent } from './details-type/other-transportation/other-transportation.component';
// import { LodgingHotelMotelComponent } from './details-type/lodging-hotel-motel/lodging-hotel-motel.component';

@NgModule({
  declarations: [
    SupportDetailsComponent,
    OverrideDatetimeComponent,
    FoodMealsComponent,
    FoodGroceriesComponent,
    TaxiTransportationComponent,
    OtherTransportationComponent,
    // LodgingHotelMotelComponent
  ],
  imports: [
    CommonModule,
    SupportDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomPipeModule
  ],
  providers: [DatePipe]
})
export class SupportDetailsModule {}
