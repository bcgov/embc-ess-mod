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
  selector: 'app-taxi-transportation',
  templateUrl: './taxi-transportation.component.html',
  styleUrls: ['./taxi-transportation.component.scss']
})
export class TaxiTransportationComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() supportDetailsForm: UntypedFormGroup;
  referralForm: UntypedFormGroup;

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
  }

  ngOnInit(): void {}

  /**
   * Returns the control of the form
   */
  get referralFormControl(): { [key: string]: AbstractControl } {
    return this.referralForm.controls;
  }
}
