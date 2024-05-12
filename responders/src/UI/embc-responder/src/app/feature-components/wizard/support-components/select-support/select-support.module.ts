import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectSupportRoutingModule } from './select-support-routing.module';
import { SelectSupportComponent } from './select-support.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SelectSupportRoutingModule, ReactiveFormsModule, SelectSupportComponent]
})
export class SelectSupportModule {}
