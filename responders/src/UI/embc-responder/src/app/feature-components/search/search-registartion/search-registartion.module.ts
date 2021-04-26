import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRegistartionRoutingModule } from './search-registartion-routing.module';
import { SearchRegistartionComponent } from './search-registartion.component';

@NgModule({
  declarations: [SearchRegistartionComponent],
  imports: [CommonModule, SearchRegistartionRoutingModule],
})
export class SearchRegistartionModule {}
