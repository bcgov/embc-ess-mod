import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SupplierListItemModel } from 'src/app/core/models/supplier-list-item.model';
import { StepSupportsService } from '../../../step-supports/step-supports.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-support-etransfer',
  templateUrl: './support-etransfer.component.html',
  styleUrls: ['./support-etransfer.component.scss']
})
export class SupportEtransferComponent {
  @Input() etransferDeliveryForm: FormGroup;
  @Input() editFlag: boolean;
  supplierList: SupplierListItemModel[];
  filteredOptions: Observable<SupplierListItemModel[]>;
  showTextField = false;
  selectedSupplierItem: SupplierListItemModel;
  showSupplierFlag = false;
  showLoader = false;
  color = '#169BD5';

  notificationPreferences = ['Email', 'Mobile', 'Email & Mobile'];

  constructor(public stepSupportsService: StepSupportsService) {}

  /**
   * Returns the control of the form
   */
  get etransferDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.etransferDeliveryForm?.controls;
  }

  /**
   * Toggles the select field based on event
   *
   * @param $event select change event
   */
  preferenceSelect($event: MatSelectChange) {
    if ($event.value === 'Someone else') {
      this.showTextField = true;
    } else {
      this.showTextField = false;
    }
  }

  showEmail(): boolean {
    const notificationPreference =
      this.etransferDeliveryForm?.get('notificationPreference')?.value || '';
    return (
      notificationPreference === 'Email' ||
      notificationPreference === 'Email & Mobile'
    );
  }

  showMobile(): boolean {
    const notificationPreference =
      this.etransferDeliveryForm?.get('notificationPreference')?.value || '';
    return (
      notificationPreference === 'Mobile' ||
      notificationPreference === 'Email & Mobile'
    );
  }
}
