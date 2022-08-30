import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-lodging-billeting',
  templateUrl: './lodging-billeting.component.html',
  styleUrls: ['./lodging-billeting.component.scss']
})
export class LodgingBilletingComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() supportDetailsForm: UntypedFormGroup;
  @Input() noOfDays: number;
  referralForm: UntypedFormGroup;
  days: number;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDetailsForm) {
      this.referralForm = this.supportDetailsForm.get(
        'referral'
      ) as UntypedFormGroup;
    }

    if (changes.noOfDays) {
      this.days = this.noOfDays;
      this.referralForm.get('noOfNights').patchValue(this.noOfDays);
    }
  }

  ngOnInit(): void {}

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }
}
