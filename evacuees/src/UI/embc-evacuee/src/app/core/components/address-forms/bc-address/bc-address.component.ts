import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Jurisdiction } from 'src/app/core/services/api/models/jurisdiction';
import { LocationService } from 'src/app/core/services/api/services/location.service';
import { startWith, map } from 'rxjs/operators';
import * as globalConst from '../../../services/globalConstants';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<Jurisdiction[]>;
  city: Jurisdiction[] = [];
  province = [globalConst.defaultProvince];

  constructor(private service: LocationService) { }

  ngOnInit(): void {
    this.service.locationGetJurisdictions().subscribe(juris => {
      this.city = juris;
    });

    this.filteredOptions = this.addressForm.get('jurisdiction').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.city.slice())
    );
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Checks if the city value exists in the list
   */
  validateCity(): boolean {
    const currentCity = this.addressForm.get('jurisdiction').value;
    let invalidCity = false;
    if (currentCity) {
      if (this.city.indexOf(currentCity) === -1) {
        invalidCity = !invalidCity;
        this.addressForm.get('jurisdiction').setErrors({ invalidCity: true });
      }
    }
    return invalidCity;
  }

  /**
   * Filters the city list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): Jurisdiction[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  /**
   * Returns the display value of autocomplete
   * @param city : Selected city object
   */
  cityDisplayFn(city: Jurisdiction): string {
    if (city) { return city.name; }
  }

}
