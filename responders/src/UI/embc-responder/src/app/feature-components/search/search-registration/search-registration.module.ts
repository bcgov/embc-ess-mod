import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRegistrationRoutingModule } from './search-registration-routing.module';
import { SearchRegistrationComponent } from './search-registration.component';

@NgModule({
  declarations: [SearchRegistrationComponent],
  imports: [CommonModule, SearchRegistrationRoutingModule]
})
export class SearchRegistrationModule {}
