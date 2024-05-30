import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedsRoutingModule } from './needs-routing.module';
import { NeedsComponent } from './needs.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, NeedsRoutingModule, ReactiveFormsModule, NeedsComponent]
})
export class NeedsModule {}
