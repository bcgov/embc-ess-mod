import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestrictionRoutingModule } from './restriction-routing.module';
import { RestrictionComponent } from './restriction.component';

@NgModule({
  declarations: [RestrictionComponent],
  imports: [CommonModule, RestrictionRoutingModule]
})
export class RestrictionModule {}
