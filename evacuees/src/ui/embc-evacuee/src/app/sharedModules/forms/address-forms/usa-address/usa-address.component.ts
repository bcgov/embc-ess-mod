import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateProvince } from '../../../../core/api/models/state-province';
import { LocationService } from '../../../../core/api/services/location.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-usa-address',
  templateUrl: './usa-address.component.html',
  styleUrls: ['./usa-address.component.scss']
})
export class UsaAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<StateProvince[]>;
  states: StateProvince[] = [];
  country = { countryCode: 'USA' };

  constructor(private service: LocationService) { }

  ngOnInit(): void {
    this.service.locationGetStateProvinces(this.country).subscribe(states => {
      this.states = states;
    });

    this.filteredOptions = this.addressForm.get('stateProvince').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.states.slice())
    );
  }

  /**
   * Checks if the state value exists in the list
   */
  // validateState(): boolean {
  //   const currentState = this.addressForm.get('stateProvince').value;
  //   let invalidState = false;
  //   if (currentState) {
  //     if (this.states.indexOf(currentState) === -1) {
  //       invalidState = !invalidState;
  //       this.addressForm.get('stateProvince').setErrors({ invalidState: true });
  //     }
  //   }
  //   return invalidState;
  // }

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
  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Filters the states list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.states.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  /**
   * Returns the display value of autocomplete
   * @param state : Selected state province object
   */
  stateDisplayFn(state: StateProvince): string {
    if (state) { return state.name; }
  }

}
