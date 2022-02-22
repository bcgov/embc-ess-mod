import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskSearchRoutingModule } from './task-search-routing.module';
import { TaskSearchComponent } from './task-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TaskSearchComponent],
  imports: [
    CommonModule,
    TaskSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TaskSearchModule {}
