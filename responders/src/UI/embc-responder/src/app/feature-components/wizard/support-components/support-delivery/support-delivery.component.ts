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
import { SupplierListItem } from 'src/app/core/api/models/supplier-list-item';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Component({
  selector: 'app-support-delivery',
  templateUrl: './support-delivery.component.html',
  styleUrls: ['./support-delivery.component.scss']
})
export class SupportDeliveryComponent implements OnInit {
  supportDeliveryForm: FormGroup;
  showTextField = false;
  filteredOptions: Observable<SupplierListItem[]>;
  supplierList: SupplierListItem[];
  selectedSupplierItem: SupplierListItem;
  showSupplierFlag = false;

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private customValidation: CustomValidationService
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

  private filter(value?: string): SupplierListItem[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.supplierList.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  displaySupplier(item: SupplierListItem) {
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

  backToDetails() {}

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
    console.log($event);
    this.selectedSupplierItem = $event.option.value;
    this.showSupplierFlag = true;
  }
}
