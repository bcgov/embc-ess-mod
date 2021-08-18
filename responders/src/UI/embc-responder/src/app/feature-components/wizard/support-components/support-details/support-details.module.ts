import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportDetailsRoutingModule } from './support-details-routing.module';
import { SupportDetailsComponent } from './support-details.component';

@NgModule({
  declarations: [SupportDetailsComponent],
  imports: [CommonModule, SupportDetailsRoutingModule]
})
export class SupportDetailsModule {}
