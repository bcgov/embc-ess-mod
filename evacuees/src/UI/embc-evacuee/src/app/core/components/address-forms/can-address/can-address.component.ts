import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateProvince } from 'src/app/core/services/api/models/state-province';
import { LocationService } from 'src/app/core/services/api/services/location.service';
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
  country = {countryCode: 'CAN'};

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

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Filters the coutry list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): StateProvince[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.provinces.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  provinceDisplayFn(province: StateProvince): string {
    if (province) { return province.name; }
  }

}
