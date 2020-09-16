import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentLoaderRoutingModule } from './component-loader-routing.module';
import { ComponentLoaderComponent } from './component-loader.component';


@NgModule({
  declarations: [
    ComponentLoaderComponent
  ],
  imports: [
    CommonModule,
    ComponentLoaderRoutingModule
  ]
})
export class ComponentLoaderModule { }
