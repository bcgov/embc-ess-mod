import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../../step-supports/step-supports.service';
import * as globalConst from '../../../../../core/services/global-constants';
import { EvacuationFileHouseholdMember } from 'src/app/core/api/models';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { MaskEvacuatedAddressPipe } from '../../../../../shared/pipes/maskEvacuatedAddress.pipe';
import { GroupLodgingDeliveryComponent } from '../delivery-types/group-lodging-delivery/group-lodging-delivery.component';
import { ShelterAllowanceDeliveryComponent } from '../delivery-types/shelter-allowance-delivery/shelter-allowance-delivery.component';
import { BilletingDeliveryComponent } from '../delivery-types/billeting-delivery/billeting-delivery.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AppLoaderComponent } from '../../../../../shared/components/app-loader/app-loader.component';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatError, MatLabel } from '@angular/material/form-field';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-support-referral',
  templateUrl: './support-referral.component.html',
  styleUrls: ['./support-referral.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatError,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatButton,
    AppLoaderComponent,
    MatCard,
    MatCardContent,
    BilletingDeliveryComponent,
    ShelterAllowanceDeliveryComponent,
    GroupLodgingDeliveryComponent,
    AsyncPipe,
    UpperCasePipe,
    MaskEvacuatedAddressPipe
  ]
})
export class SupportReferralComponent implements OnInit {
  @Input() referralDeliveryForm: UntypedFormGroup;
  @Input() editFlag: boolean;
  @Input() cloneFlag: boolean;
  supplierList: SupplierListItemModel[];
  filteredOptions: Observable<SupplierListItemModel[]>;
  showTextField = false;
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';

  constructor(
    public stepSupportsService: StepSupportsService,
    private alertService: AlertService,
    public evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.supplierList = this.stepSupportsService.supplierList;
    this.referralDeliveryForm?.get('issuedTo')?.valueChanges.subscribe((value) => {
      this.referralDeliveryForm.get('name').updateValueAndValidity();
    });

    this.filteredOptions = this.referralDeliveryForm?.get('supplier')?.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this.filter(value) : this.supplierList !== undefined ? this.supplierList.slice() : null))
    );

    this.populateExistingIssuedTo();

    if (this.cloneFlag) {
      this.referralDeliveryForm?.get('issuedTo')?.disable();
    }

    if (this.referralDeliveryForm?.get('supplier')?.value) {
      this.selectedSupplierItem = this.referralDeliveryForm?.get('supplier')?.value;
      this.showSupplierFlag = true;
    }
  }

  displaySupplier(item: SupplierListItemModel) {
    if (item) {
      return item.name;
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.referralDeliveryForm?.controls;
  }

  /**
   * Shows the supplier details box
   *
   * @param $event auto complete event
   */
  showDetails($event: MatAutocompleteSelectedEvent) {
    this.selectedSupplierItem = $event.option.value;
    this.showSupplierFlag = true;
  }

  /**
   * Checks if the city value exists in the list
   */
  validateSupplier(): boolean {
    const currentSupplier = this.referralDeliveryForm?.get('supplier')?.value;
    let invalidSupplier = false;
    if (currentSupplier !== null && currentSupplier?.name === undefined) {
      invalidSupplier = !invalidSupplier;
      this.referralDeliveryForm?.get('supplier').setErrors({ invalidSupplier: true });
    }
    return invalidSupplier;
  }

  populateExistingIssuedTo() {
    const allMembers: EvacuationFileHouseholdMember[] =
      this.evacueeSessionService?.evacFile?.needsAssessment?.householdMembers;

    if (this.editFlag) {
      if (this.stepSupportsService?.supportDelivery?.issuedTo !== undefined) {
        const valueToSet = allMembers.find((mem) => mem.id === this.stepSupportsService?.supportDelivery?.issuedTo?.id);
        this.referralDeliveryForm?.get('issuedTo').setValue(valueToSet);
      } else {
        this.referralDeliveryForm?.get('issuedTo').setValue('Someone else');
        this.showTextField = true;
      }
    } else {
      if (this.stepSupportsService?.supportDelivery?.issuedTo !== undefined) {
        const valueToSet = allMembers.find((mem) => mem.id === this.stepSupportsService?.supportDelivery?.issuedTo?.id);
        if (valueToSet !== undefined) {
          this.referralDeliveryForm?.get('issuedTo').setValue(valueToSet);
        } else {
          this.referralDeliveryForm?.get('issuedTo').setValue('Someone else');
          this.showTextField = true;
        }
      }
    }
  }

  /**
   * Refreshes the supplier list
   */
  refreshList() {
    this.showLoader = true;
    this.stepSupportsService.getSupplierList().subscribe({
      next: (value) => {
        this.showLoader = false;
        this.stepSupportsService.supplierList = value;
        this.supplierList = value;
        this.filteredOptions = this.referralDeliveryForm.get('supplier').valueChanges.pipe(
          startWith(''),
          map((input) => this.filter(input))
        );
      },
      error: (error) => {
        this.showLoader = false;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.supplierRefresherror);
      }
    });
  }

  /**
   * Toggles the select field based on event
   *
   * @param $event select change event
   */
  memberSelect($event: MatSelectChange) {
    if ($event.value === 'Someone else') {
      this.showTextField = true;
    } else {
      this.showTextField = false;
    }
  }

  private filter(value?: string): SupplierListItemModel[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.supplierList.filter((option) => option.name.toLowerCase().includes(filterValue));
    }
  }
}
