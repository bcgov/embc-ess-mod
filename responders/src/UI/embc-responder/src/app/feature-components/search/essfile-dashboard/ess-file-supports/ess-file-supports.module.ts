import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssFileSupportsRoutingModule } from './ess-file-supports-routing.module';
import { EssFileSupportsComponent } from './ess-file-supports.component';

@NgModule({
  imports: [CommonModule, EssFileSupportsRoutingModule, EssFileSupportsComponent]
})
export class EssFileSupportsModule {}
