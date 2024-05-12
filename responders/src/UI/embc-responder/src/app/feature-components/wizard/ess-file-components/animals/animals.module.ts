import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimalsRoutingModule } from './animals-routing.module';
import { AnimalsComponent } from './animals.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, AnimalsRoutingModule, MaterialModule, ReactiveFormsModule, SharedModule, AnimalsComponent],
    exports: [AnimalsComponent]
})
export class AnimalsModule {}
