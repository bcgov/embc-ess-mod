import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchWrapperComponent } from './search-wrapper.component';
import { SearchWrapperRoutingModule } from './search-wrapper-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [CommonModule, SearchWrapperRoutingModule, SharedModule, SearchWrapperComponent]
})
export class SearchWrapperModule {}
