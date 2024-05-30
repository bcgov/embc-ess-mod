import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteSearchRoutingModule } from './remote-search-routing.module';
import { RemoteSearchComponent } from './remote-search.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RemoteSearchRoutingModule, ReactiveFormsModule, RemoteSearchComponent]
})
export class RemoteSearchModule {}
