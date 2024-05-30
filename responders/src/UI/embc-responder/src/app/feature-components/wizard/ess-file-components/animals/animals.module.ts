import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimalsRoutingModule } from './animals-routing.module';
import { AnimalsComponent } from './animals.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, AnimalsRoutingModule, ReactiveFormsModule, AnimalsComponent],
  exports: [AnimalsComponent]
})
export class AnimalsModule {}
