import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavMenuComponent } from './components/top-nav-menu/top-nav-menu.component';
import { RouterModule } from '@angular/router';
import { ToggleSideNavComponent } from './components/toggle-side-nav/toggle-side-nav.component';
import { MaterialModule } from '../material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TopNavMenuComponent,
    ToggleSideNavComponent,
    DataTableComponent,
    SearchFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    TopNavMenuComponent,
    ToggleSideNavComponent,
    DataTableComponent,
    SearchFilterComponent
  ]
})
export class SharedModule { }
