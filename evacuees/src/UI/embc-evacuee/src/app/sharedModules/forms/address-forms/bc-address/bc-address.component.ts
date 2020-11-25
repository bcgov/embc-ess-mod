import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocationService } from '../../../../core/services/api/location.service';
import { startWith, map } from 'rxjs/operators';
import * as globalConst from '../../../../core/services/globalConstants';
import { Jurisdiction } from '../../../../core/services/api/models/jurisdiction';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit, AfterViewChecked {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<Jurisdiction[]>;
  city: Jurisdiction[] = [];
  province = [globalConst.defaultProvince];

  constructor(private service: LocationService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.locationGetJurisdictions().subscribe(juris => {
      this.city = juris;
    });

    this.filteredOptions = this.addressForm.get('jurisdiction').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.city.slice())
    );
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
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
    if (currentCity !== null && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.addressForm.get('jurisdiction').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  // validateCity(): boolean {
  //   const currentCity = this.addressForm.get('jurisdiction').value;
  //   let invalidCity = false;
  //   if (currentCity && this.city.length > 0) {
  //    //this.city.findIndex()
  //    console.log(currentCity.name)
  //    // this.compareObjects(currentCity, )
  //     if (this.city.indexOf(currentCity) === -1) {
  //       console.log('owlman')
  //       invalidCity = !invalidCity;
  //       this.addressForm.get('jurisdiction').setErrors({ invalidCity: true });
  //     }
  //   }
  //   return invalidCity;
  // }

  compareObjects<T extends Jurisdiction>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
        return null;
    }
    return c1.code === c2.code;
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
