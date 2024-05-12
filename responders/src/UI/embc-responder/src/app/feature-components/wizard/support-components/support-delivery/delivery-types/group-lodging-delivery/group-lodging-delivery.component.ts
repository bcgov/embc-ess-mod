import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Community, LocationsService } from 'src/app/core/services/locations.service';
import * as globalConst from '../../../../../../core/services/global-constants';
import { IMaskDirective } from 'angular-imask';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-group-lodging-delivery',
  templateUrl: './group-lodging-delivery.component.html',
  styleUrls: ['./group-lodging-delivery.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    IMaskDirective,
    AsyncPipe
  ]
})
export class GroupLodgingDeliveryComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() supportDeliveryForm: UntypedFormGroup;
  filteredOptions: Observable<Community[]>;
  detailsForm: UntypedFormGroup;
  city: Community[] = [];

  readonly phoneMask = globalConst.phoneMask;

  constructor(
    private locationService: LocationsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.city = this.locationService.getActiveCommunityList();

    this.filteredOptions = this.detailsForm.get('hostCity').valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this.filter(value) : this.city.slice()))
    );
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportDeliveryForm) {
      this.detailsForm = this.supportDeliveryForm.get('details') as UntypedFormGroup;
    }
  }

  /**
   * Returns the control of the form
   */
  get supportDeliveryFormControl(): { [key: string]: AbstractControl } {
    return this.detailsForm.controls;
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param city : Selected city object
   */
  cityDisplayFn(city: Community): string {
    if (city) {
      return city.name;
    }
  }

  getCommunityCode(community: Community) {
    this.detailsForm.get('hostCommunityCode').setValue(community);
  }
  /**
   * Checks if the city value exists in the list
   */
  validateCity(): boolean {
    const currentCity = this.detailsForm.get('hostCity').value;
    let invalidCity = false;
    if (currentCity !== null && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.detailsForm.get('hostCity').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  /**
   * Filters the city list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): Community[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter((option) => option.name.toLowerCase().includes(filterValue));
    }
  }
}
