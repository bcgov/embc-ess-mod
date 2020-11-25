import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateProvince } from '../../../../core/services/api/models/state-province';
import { LocationService } from '../../../../core/services/api/location.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-can-address',
  templateUrl: './can-address.component.html',
  styleUrls: ['./can-address.component.scss']
})
export class CanAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<StateProvince[]>;
  provinces: StateProvince[] = [];
  country = { countryCode: 'CAN' };

  constructor(private service: LocationService) { }

  ngOnInit(): void {
    this.service.locationGetStateProvinces(this.country).subscribe(provinces => {
      this.provinces = provinces;
    });

    this.filteredOptions = this.addressForm.get('stateProvince').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.provinces.slice())
    );
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Checks if the province value exists in the list
   */
  // validateProvince(): boolean {
  //   const currentProvince = this.addressForm.get('stateProvince').value;
  //   let invalidProvince = false;
  //   if (currentProvince) {
  //     if (this.provinces.indexOf(currentProvince) === -1) {
  //       invalidProvince = !invalidProvince;
  //       this.addressForm.get('stateProvince').setErrors({ invalidProvince: true });
  //     }
  //   }
  //   return invalidProvince;
  // }

  validateProvince(): boolean {
    const currentProvince = this.addressForm.get('stateProvince').value;
    let invalidProvince = false;
    if (currentProvince !== null && currentProvince.name === undefined) {
      invalidProvince = !invalidProvince;
      this.addressForm.get('stateProvince').setErrors({ invalidProvince: true });
    }
    return invalidProvince;
  }


  /**
   * Filters the province list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.provinces.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  /**
   * Returns the display value of autocomplete
   * @param province : Selected state province object
   */
  provinceDisplayFn(province: StateProvince): string {
    if (province) { return province.name; }
  }

}
