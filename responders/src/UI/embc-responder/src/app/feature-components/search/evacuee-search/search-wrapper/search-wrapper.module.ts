import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchWrapperComponent } from './search-wrapper.component';
import { SearchWrapperRoutingModule } from './search-wrapper-routing.module';

@NgModule({
  imports: [CommonModule, SearchWrapperRoutingModule, SearchWrapperComponent]
})
export class SearchWrapperModule {}
