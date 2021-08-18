import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectSupportRoutingModule } from './select-support-routing.module';
import { SelectSupportComponent } from './select-support.component';

@NgModule({
  declarations: [SelectSupportComponent],
  imports: [CommonModule, SelectSupportRoutingModule]
})
export class SelectSupportModule {}
