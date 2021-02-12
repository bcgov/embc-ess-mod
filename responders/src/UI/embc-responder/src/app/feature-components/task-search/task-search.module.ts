import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskSearchRoutingModule } from './task-search-routing.module';
import { TaskSearchComponent } from './task-search.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    TaskSearchComponent
  ],
  imports: [
    CommonModule,
    TaskSearchRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class TaskSearchModule { }
