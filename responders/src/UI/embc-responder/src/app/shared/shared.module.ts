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
import { BcAddressComponent } from './forms/address-forms/bc-address/bc-address.component';
import { CanAddressComponent } from './forms/address-forms/can-address/can-address.component';
import { UsaAddressComponent } from './forms/address-forms/usa-address/usa-address.component';
import { OtherAddressComponent } from './forms/address-forms/other-address/other-address.component';
import { PersonDetailFormComponent } from './forms/person-detail-form/person-detail-form.component';
import { PetFormComponent } from './forms/pet-form/pet-form.component';
import { TextMaskModule } from 'angular2-text-mask';
import { StatusDefinitionDialogComponent } from './components/dialog-components/status-definition-dialog/status-definition-dialog.component';
import { VerifyEvacueeDialogComponent } from './components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { OverlayLoaderComponent } from './components/overlay-loader/overlay-loader.component';
import { FileStatusDefinitionComponent } from './components/dialog-components/file-status-definition/file-status-definition.component';
import { FileDashboardVerifyDialogComponent } from './components/dialog-components/file-dashboard-verify-dialog/file-dashboard-verify-dialog.component';

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
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent,
    PersonDetailFormComponent,
    PetFormComponent,
    StatusDefinitionDialogComponent,
    VerifyEvacueeDialogComponent,
    OverlayLoaderComponent,
    FileStatusDefinitionComponent,
    FileDashboardVerifyDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule
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
    BcAddressComponent,
    CanAddressComponent,
    UsaAddressComponent,
    OtherAddressComponent,
    PersonDetailFormComponent,
    PetFormComponent,
    StatusDefinitionDialogComponent,
    VerifyEvacueeDialogComponent,
    OverlayLoaderComponent,
    FileStatusDefinitionComponent,
    FileDashboardVerifyDialogComponent
  ]
})
export class SharedModule {}
