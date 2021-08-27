import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit {
  supportDeliveryForm: FormGroup;
  showTextField = false;
  filteredOptions: Observable<SupplierListItemModel[]>;
  supplierList: SupplierListItemModel[];
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.createSupportDetailsForm();
    this.supplierList = this.stepSupportsService.supplierList;
    this.supportDeliveryForm.get('issuedTo').valueChanges.subscribe((value) => {
      this.supportDeliveryForm.get('name').updateValueAndValidity();
    });

    this.filteredOptions = this.supportDeliveryForm
      .get('supplier')
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          value
            ? this.filter(value)
            : this.supplierList !== undefined
            ? this.supplierList.slice()
            : null
        )
      );
  }

  displaySupplier(item: SupplierListItemModel) {
    if (item) {
      return item.name;
    }
  }

  /**
   * Navigates to select-support page
   */
  back() {
    this.router.navigate(['/ess-wizard/add-supports/details']);
  }

  createSupportDetailsForm(): void {
    this.supportDeliveryForm = this.formBuilder.group({
      issuedTo: ['', [Validators.required]],
      name: [
        '',
        [
          this.customValidation
            .conditionalValidation(
              () =>
                this.supportDeliveryForm.get('issuedTo').value ===
                'Someone else',
              this.customValidation.whitespaceValidator()
            )
            .bind(this.customValidation)
        ]
      ],
      supplier: ['', [Validators.required]],
      supplierNote: ['', [this.customValidation.whitespaceValidator()]]
    });
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.supportDeliveryForm.controls;
  }

  backToDetails() {
    this.router.navigate(['/ess-wizard/add-supports/details']);
  }

  next() {}

  memberSelect($event: MatSelectChange) {
    console.log($event);
    if ($event.value === 'Someone else') {
      this.showTextField = true;
    } else {
      this.showTextField = false;
    }
  }

  showDetails($event: MatAutocompleteSelectedEvent) {
    this.selectedSupplierItem = $event.option.value;
    this.showSupplierFlag = true;
  }

  refreshList() {
    this.showLoader = !this.showLoader;
    this.stepSupportsService.getSupplierList().subscribe(
      (value) => {
        this.showLoader = !this.showLoader;
        this.stepSupportsService.supplierList = value;
      },
      (error) => {
        this.showLoader = !this.showLoader;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.supplierRefresherror);
      }
    );
  }

  private filter(value?: string): SupplierListItemModel[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.supplierList.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }
}
