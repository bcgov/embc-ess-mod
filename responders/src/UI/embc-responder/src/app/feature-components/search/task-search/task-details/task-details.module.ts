import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { TaskDetailsComponent } from './task-details.component';

@NgModule({
  imports: [CommonModule, TaskDetailsRoutingModule, TaskDetailsComponent]
})
export class TaskDetailsModule {}
