import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRegistrationRoutingModule } from './search-registration-routing.module';
import { SearchRegistrationComponent } from './search-registration.component';

@NgModule({
  imports: [CommonModule, SearchRegistrationRoutingModule, SearchRegistrationComponent]
})
export class SearchRegistrationModule {}
