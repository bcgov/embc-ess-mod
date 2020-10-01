import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateProvince } from 'src/app/core/services/api/models/state-province';
import { LocationService } from 'src/app/core/services/api/services/location.service';
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

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.states.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  stateDisplayFn(state: StateProvince): string {
    if (state) { return state.name; }
  }

}
