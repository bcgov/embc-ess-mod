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
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-other-transportation',
  templateUrl: './other-transportation.component.html',
  styleUrls: ['./other-transportation.component.scss']
})
export class OtherTransportationComponent
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
