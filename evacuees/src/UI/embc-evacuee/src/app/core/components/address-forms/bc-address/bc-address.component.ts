import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Jurisdiction } from 'src/app/core/services/api/models/jurisdiction';
import { LocationService } from 'src/app/core/services/api/services/location.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<Jurisdiction[]>;
  city: Jurisdiction[] = [];

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

  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Filters the coutry list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): Jurisdiction[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  cityDisplayFn(city: Jurisdiction): string {
    if (city) { return city.name; }
  }

}
