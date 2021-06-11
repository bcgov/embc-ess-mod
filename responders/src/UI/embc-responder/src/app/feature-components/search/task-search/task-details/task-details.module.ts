import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { TaskDetailsComponent } from './task-details.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [TaskDetailsComponent],
  imports: [CommonModule, TaskDetailsRoutingModule, MaterialModule]
})
export class TaskDetailsModule {}
