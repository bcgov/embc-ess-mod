import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  LocationsService,
  StateProvince
} from '../../../../core/services/locations.service';

@Component({
  selector: 'app-usa-address',
  templateUrl: './usa-address.component.html',
  styleUrls: ['./usa-address.component.scss']
})
export class UsaAddressComponent implements OnInit {
  @Input() addressForm: UntypedFormGroup;
  filteredOptions: Observable<StateProvince[]>;
  states: StateProvince[] = [];
  country = { countryCode: 'USA' };

  constructor(private locationService: LocationsService) {}

  ngOnInit(): void {
    this.states = this.locationService
      .getActiveStateProvinceList()
      .filter((sp) => sp.countryCode === this.country.countryCode);

    this.filteredOptions = this.addressForm
      .get('stateProvince')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (value ? this.filter(value) : this.states.slice()))
      );
  }

  validateState(): boolean {
    const currentState = this.addressForm.get('stateProvince').value;
    let invalidState = false;
    if (currentState !== null && currentState.name === undefined) {
      invalidState = !invalidState;
      this.addressForm.get('stateProvince').setErrors({ invalidState: true });
    }
    return invalidState;
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param state : Selected state province object
   */
  stateDisplayFn(state: StateProvince): string {
    if (state) {
      return state.name;
    }
  }

  /**
   * Filters the states list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.states.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }
}
