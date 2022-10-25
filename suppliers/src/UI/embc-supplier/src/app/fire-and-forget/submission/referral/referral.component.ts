import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  AbstractControl,
  Validators
} from '@angular/forms';
import {
  NgbDateParserFormatter,
  NgbCalendar,
  NgbDateAdapter,
  NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserService } from 'src/app/core/services/dateParser.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { CustomDateAdapterService } from 'src/app/core/services/customDateAdapter.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapterService },
    { provide: NgbDateParserFormatter, useClass: DateParserService },
    NgbDatepickerConfig
  ]
})
export class ReferralComponent implements OnInit {
  @Input() formGroupName: number;
  @Input() referralForm: UntypedFormGroup;
  @Input() index: number;
  @Input() component: string;
  @Output() referralToRemove = new EventEmitter<number>();
  @Input() invoiceCurrentIndex: number;
  @Input() formArraySize: number;
  supportList: any;
  reloadedFiles: any;
  reloadedFiles2: any;
  noOfAttachments = 1;

  constructor(
    private builder: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private supplierService: SupplierService,
    private customValidator: CustomValidationService,
    config: NgbDatepickerConfig
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    config.outsideDays = 'hidden';
    config.firstDayOfWeek = 7;
  }

  get referralRows() {
    return this.referralForm.get('referralRows') as UntypedFormArray;
  }

  get referralAttachments() {
    return this.referralForm.get('referralAttachments') as UntypedFormArray;
  }

  get receiptAttachments() {
    return this.referralForm.get('receiptAttachments') as UntypedFormArray;
  }

  get referralControl() {
    return this.referralForm.controls;
  }

  get rowControl() {
    return (this.referralForm.controls.referralRows as UntypedFormArray)
      .controls;
  }

  ngOnInit() {
    this.supportList = this.supplierService.getSupportItems();
    if (this.component === 'R' && this.referralForm !== null) {
      this.referralForm.get('receiptNumber').setValue(String(this.index + 1));
    }
    if (this.supplierService.isReload) {
      this.loadWithExistingValues();
    } else if (!this.referralRows?.controls?.length) {
      this.referralRows.push(this.createRowForm());
    }
    this.onChanges();
  }
  loadWithExistingValues() {
    const storedSupplierDetails = this.supplierService.getSupplierDetails();
    if (this.component === 'I') {
      const rowList =
        storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[
          this.index
        ].referralRows;
      this.reloadedFiles =
        storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[
          this.index
        ].referralAttachments;
      this.reloadedFiles.forEach((element) => {
        this.referralAttachments.push(
          this.createAttachmentObject({
            fileName: element.fileName,
            file: element.file
          })
        );
      });
      this.reloadedFiles2 =
        storedSupplierDetails.invoices[this.invoiceCurrentIndex].referrals[
          this.index
        ].receiptAttachments;
      this.reloadedFiles2.forEach((element) => {
        this.receiptAttachments.push(
          this.createAttachmentObject({
            fileName: element.fileName,
            file: element.file
          })
        );
      });
      rowList.forEach((row) => {
        this.referralRows.push(this.createRowFormWithValues(row));
      });
    } else if (this.component === 'R') {
      const rowList =
        storedSupplierDetails.receipts[this.invoiceCurrentIndex].referrals[
          this.index
        ].referralRows;
      rowList.forEach((row) => {
        this.referralRows.push(this.createRowFormWithValues(row));
      });
    }
    this.cd.detectChanges();
  }

  createRowForm() {
    return this.builder.group({
      supportProvided: ['', Validators.required],
      description: [''],
      amount: ['', Validators.required]
    });
  }

  onChanges() {
    this.referralForm.get('referralRows').valueChanges.subscribe((formrow) => {
      const amtSum = formrow
        .reduce((prev, next) => prev + +next.amount, 0)
        .toFixed(2);
      this.referralForm.get('totalAmount').setValue(amtSum);
    });
  }

  deleteRow(rowIndex: number) {
    this.referralRows.removeAt(rowIndex);
  }

  addRow() {
    this.referralRows.push(this.createRowForm());
    this.cd.detectChanges();
  }

  setReferralFormControl(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.referralAttachments.push(
        this.createAttachmentObject({
          fileName: event.name,
          file: reader.result,
          contentType: event.type
        })
      );
    };
    // this.cd.markForCheck();
  }

  deleteReferralFormControl(event: any) {
    this.referralAttachments.removeAt(event);
  }

  setReceiptFormControl(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.receiptAttachments.push(
        this.createAttachmentObject({
          fileName: event.name,
          file: reader.result,
          contentType: event.type
        })
      );
    };
    // this.cd.markForCheck();
  }

  deleteReceiptFormControl(event: any) {
    this.receiptAttachments.removeAt(event);
  }

  createAttachmentObject(data: any) {
    return this.builder.group(data);
  }

  createRowFormWithValues(row: any) {
    return this.builder.group({
      supportProvided: [row.supportProvided, Validators.required],
      description: [row.description],
      amount: [row.amount, Validators.required]
    });
  }

  checkAttachmentLength(control: []) {
    return control.length > 0;
  }
}
