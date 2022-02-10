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
import { LodgingHotelMotelComponent } from './details-type/lodging-hotel-motel/lodging-hotel-motel.component';
import { LodgingBilletingComponent } from './details-type/lodging-billeting/lodging-billeting.component';
import { LodgingGroupComponent } from './details-type/lodging-group/lodging-group.component';
import { ClothingComponent } from './details-type/clothing/clothing.component';
import { IncidentalsComponent } from './details-type/incidentals/incidentals.component';
import { CustomDirectiveModule } from 'src/app/shared/directives/customDirective.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
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
    IncidentalsComponent
  ],
  imports: [
    CommonModule,
    SupportDetailsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CustomPipeModule,
    CustomDirectiveModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class SupportDetailsModule {}
