import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimalsRoutingModule } from './animals-routing.module';
import { AnimalsComponent } from './animals.component';

@NgModule({
  declarations: [AnimalsComponent],
  imports: [CommonModule, AnimalsRoutingModule]
})
export class AnimalsModule {}
