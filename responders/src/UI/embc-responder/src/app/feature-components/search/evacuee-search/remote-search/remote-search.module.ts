import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteSearchRoutingModule } from './remote-search-routing.module';
import { RemoteSearchComponent } from './remote-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RemoteSearchComponent],
  imports: [
    CommonModule,
    RemoteSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class RemoteSearchModule {}
