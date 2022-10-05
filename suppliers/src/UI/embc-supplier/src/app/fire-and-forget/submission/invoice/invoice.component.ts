import {
  Component,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormArray,
  Validators
} from '@angular/forms';
import {
  NgbDateParserFormatter,
  NgbCalendar,
  NgbDateAdapter,
  NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { DateParserService } from 'src/app/core/services/dateParser.service';
import { CustomDateAdapterService } from 'src/app/core/services/customDateAdapter.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import * as globalConst from 'src/app/core/services/globalConstants';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapterService },
    { provide: NgbDateParserFormatter, useClass: DateParserService },
    CustomValidationService,
    NgbDatepickerConfig
  ]
})
export class InvoiceComponent implements OnInit {
  @Input() formGroupName: number;
  @Input() invoiceForm: UntypedFormGroup;
  @Input() index: number;
  @Input() formArraySize: number;
  @Output() indexToRemove = new EventEmitter<number>();
  referralList = globalConst.referralList;
  component = 'I';
  reloadedFiles: any;
  hidden = false;
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

  /**
   * Gets the form control
   */
  get invoiceControl() {
    return this.invoiceForm.controls;
  }

  /**
   * Gets attachment form array
   */
  get invoiceAttachments() {
    return this.invoiceForm.get('invoiceAttachments') as UntypedFormArray;
  }

  get referrals() {
    return this.invoiceForm.get('referrals') as UntypedFormArray;
  }

  /**
   * Creates attachment form group
   *
   * @param data :Attachment metadata
   */
  createAttachmentObject(data: any) {
    return this.builder.group(data);
  }

  ngOnInit() {
    this.onChanges();
    if (this.supplierService.isReload) {
      this.loadWithExistingValues();
    }
  }

  /**
   * Loads data for back/forward navigation
   */
  loadWithExistingValues() {
    const storedSupplierDetails = this.supplierService.getSupplierDetails();
    this.reloadedFiles =
      storedSupplierDetails.invoices[this.index].invoiceAttachments;
    storedSupplierDetails.invoices[this.index].invoiceAttachments.forEach(
      (element) => {
        this.invoiceAttachments.push(
          this.createAttachmentObject({
            fileName: element.fileName,
            file: element.file
          })
        );
      }
    );
    const referralList = storedSupplierDetails.invoices[this.index].referrals;
    if (referralList.length > 0) {
      this.hidden = true;
    }
    referralList.forEach((referral) => {
      this.referrals.push(this.createReferralFormArrayWithValues(referral));
    });
    this.cd.detectChanges();
  }

  /**
   * Reads the attachment content and encodes it as base64
   *
   * @param event : Attachment drop/browse event
   */
  setFileFormControl(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.invoiceAttachments.push(
        this.createAttachmentObject({
          fileName: event.name,
          file: reader.result,
          contentType: event.type,
          fileSize: event.size
        })
      );
    };
    this.cd.markForCheck();
  }

  onChanges() {
    this.invoiceForm.get('referrals').valueChanges.subscribe((template) => {
      const totalAmount = template
        .reduce((prev, next) => prev + +next.totalAmount, 0)
        .toFixed(2);
      this.invoiceForm.get('invoiceTotalAmount').setValue(totalAmount);
    });
  }

  /**
   * Deletes attachments
   *
   * @param event : Output event for delete
   */
  deleteFileFormControl(event: any) {
    this.invoiceAttachments.removeAt(event);
  }

  /**
   * Creates Referral form array
   */
  createReferralFormArray() {
    return this.builder.group({
      referralNumber: [
        '',
        [
          Validators.required,
          this.customValidator
            .referralNumberValidator(this.referrals)
            .bind(this.customValidator)
        ]
      ],
      referralRows: this.builder.array([], Validators.required),
      totalAmount: [''],
      referralAttachments: this.builder.array([], [Validators.required]),
      receiptAttachments: this.builder.array([])
    });
  }

  /**
   * Injects referral tempate to the view
   */
  injectTemplateReferral() {
    this.referrals.push(this.createReferralFormArray());
    this.cd.detectChanges();
  }

  /**
   * Adds referral to the referral form array
   *
   * @param templateNo : refers to the tempate index in the array
   */
  addReferralTemplate(templateNo: number) {
    if (templateNo !== undefined && templateNo !== 0) {
      this.hidden = !this.hidden;
    }
    for (let i = 0; i < templateNo; i++) {
      this.injectTemplateReferral();
    }
  }

  addSingleReferralTemplate() {
    this.injectTemplateReferral();
  }

  cleanReferrals() {
    this.referrals.clear();
  }

  /**
   * Open confirmation modal to delete referral from the form array
   *
   * @param event : Output event for delete
   */
  removeReferral(event: any) {
    this.supplierService
      .confirmModal(
        globalConst.deleteRefferalMsg,
        globalConst.deleteReferalButton
      )
      .subscribe((e) => {
        if (e) {
          this.referrals.removeAt(event);
        }
      });
  }

  /**
   * Populates existing referral form enteries to the array
   *
   * @param referral :Existing referral enteries
   */
  createReferralFormArrayWithValues(referral: any) {
    return this.builder.group({
      referralNumber: [referral.referralNumber, Validators.required],
      referralRows: this.builder.array([], Validators.required),
      totalAmount: [referral.totalAmount],
      referralAttachments: this.builder.array([], [Validators.required]),
      receiptAttachments: this.builder.array([])
    });
  }

  checkAttachmentLength(control: []) {
    return control.length > 0;
  }
}
