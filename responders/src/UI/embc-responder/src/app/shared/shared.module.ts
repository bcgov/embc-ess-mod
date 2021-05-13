import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavMenuComponent } from './components/top-nav-menu/top-nav-menu.component';
import { RouterModule } from '@angular/router';
import { ToggleSideNavComponent } from './components/toggle-side-nav/toggle-side-nav.component';
import { MaterialModule } from '../material.module';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/dialog/dialog.component';
import { AlertComponent } from './components/alert/alert.component';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { DeleteConfirmationDialogComponent } from './components/dialog-components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { InformationDialogComponent } from './components/dialog-components/information-dialog/information-dialog.component';
import { ExitWizardDialogComponent } from './components/dialog-components/exit-wizard-dialog/exit-wizard-dialog.component';
import { BcAddressComponent } from './forms/address-forms/bc-address/bc-address.component';
import { CanAddressComponent } from './forms/address-forms/can-address/can-address.component';
import { UsaAddressComponent } from './forms/address-forms/usa-address/usa-address.component';
import { OtherAddressComponent } from './forms/address-forms/other-address/other-address.component';

@NgModule({
  declarations: [
    TopNavMenuComponent,
    ToggleSideNavComponent,
    SearchFilterComponent,
    DialogComponent,
    AlertComponent,
    AppLoaderComponent,
    DeleteConfirmationDialogComponent,
    InformationDialogComponent,
    ExitWizardDialogComponent,
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TopNavMenuComponent,
    ToggleSideNavComponent,
    SearchFilterComponent,
    DialogComponent,
    AlertComponent,
    AppLoaderComponent,
    DeleteConfirmationDialogComponent,
    InformationDialogComponent,
    ExitWizardDialogComponent,
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent
  ]
})
export class SharedModule {}
