import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskSearchRoutingModule } from './task-search-routing.module';
import { TaskSearchComponent } from './task-search.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TaskSearchRoutingModule, ReactiveFormsModule, TaskSearchComponent]
})
export class TaskSearchModule {}
