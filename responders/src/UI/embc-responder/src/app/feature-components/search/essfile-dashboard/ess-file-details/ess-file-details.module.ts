import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileDetailsRoutingModule } from './ess-file-details-routing.module';
import { EssFileDetailsComponent } from './ess-file-details.component';


@NgModule({
  declarations: [
    EssFileDetailsComponent
  ],
  imports: [
    CommonModule,
    EssFileDetailsRoutingModule
  ]
})
export class EssFileDetailsModule { }
