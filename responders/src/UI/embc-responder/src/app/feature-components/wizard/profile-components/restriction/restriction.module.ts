import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestrictionRoutingModule } from './restriction-routing.module';
import { RestrictionComponent } from './restriction.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [RestrictionComponent],
  imports: [CommonModule, RestrictionRoutingModule, MaterialModule]
})
export class RestrictionModule {}
