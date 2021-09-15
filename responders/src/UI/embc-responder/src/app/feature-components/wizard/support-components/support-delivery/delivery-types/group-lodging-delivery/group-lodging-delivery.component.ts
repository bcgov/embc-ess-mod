import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as globalConst from '../../../../../../core/services/global-constants';

@Component({
  selector: 'app-group-lodging-delivery',
  templateUrl: './group-lodging-delivery.component.html',
  styleUrls: ['./group-lodging-delivery.component.scss']
})
export class GroupLodgingDeliveryComponent implements OnInit, OnChanges {
  @Input() supportDeliveryForm: FormGroup;
  detailsForm: FormGroup;

  readonly phoneMask = globalConst.phoneMask;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDeliveryForm) {
      this.detailsForm = this.supportDeliveryForm.get('details') as FormGroup;
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.detailsForm.controls;
  }
}
