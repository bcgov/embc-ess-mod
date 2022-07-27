import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteSearchRoutingModule } from './remote-search-routing.module';
import { RemoteSearchComponent } from './remote-search.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RemoteSearchComponent],
  imports: [
    CommonModule,
    RemoteSearchRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RemoteSearchModule {}
