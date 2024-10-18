import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { LocationService, StateProvince } from 'src/app/core/services/location.service';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-can-address',
  templateUrl: './can-address.component.html',
  styleUrls: ['./can-address.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule, AsyncPipe]
})
export class CanAddressComponent implements OnInit {
  @Input() addressForm: UntypedFormGroup;
  filteredOptions: Observable<StateProvince[]>;
  provinces: StateProvince[] = [];
  country = { countryCode: 'CAN' };

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.provinces = this.locationService
      .getActiveStateProvinceList()
      .filter((sp) => sp.countryCode === this.country.countryCode);

    this.filteredOptions = this.addressForm.get('stateProvince').valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this.filter(value) : this.provinces.slice()))
    );
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

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
   * Returns the display value of autocomplete
   *
   * @param province : Selected state province object
   */
  provinceDisplayFn(province: StateProvince): string {
    if (province) {
      return province.name;
    }
  }

  /**
   * Filters the province list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.provinces.filter((option) => option.name.toLowerCase().includes(filterValue));
    }
  }
}
