import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AddressModel } from 'src/app/core/models/address.model';
import {
  Community,
  LocationsService
} from 'src/app/core/services/locations.service';
import * as _ from 'lodash';

@Pipe({ name: 'maskFullAddress' })
export class MaskFullAddressPipe implements PipeTransform {
  constructor(
    private locationService: LocationsService,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Converts Address object into sanitized 4-lines format for display on pages.
   * Due to HTML sanitization, cannot be {{ interpolated }}, must use [innerHTML]
   *
   * @param address Address object to display on page
   * @returns Sanitized Two-line SafeHTML string, <br> as only included HTML
   */
  transform(address: AddressModel): SafeHtml {
    if (address !== null && address !== undefined) {
      const communities = this.locationService.getCommunityList();

      const line1 = address.addressLine1;
      const line2 = address.addressLine2;
      let line3 = '';
      let line4 = '';

      const communityName =
        (address.community as Community)?.name ?? address.city ?? '';

      // Only set line 2 if city exists
      if (communityName.length > 0) {
        line3 = communityName;

        if (address.stateProvince?.name.length > 0)
          line3 += ', ' + address.stateProvince.code;
        if (address.postalCode?.length > 0) line4 += address.postalCode + ', ';
      }

      line4 += address.country.name;

      // All values must be HTML-sanitized for us to include <br> line break.
      let addressStr = _.escape(line1);

      if (address.addressLine2?.length > 0)
        addressStr += '<br>' + _.escape(line2) + ',';
      else addressStr += ',';

      if (line3.length > 0) addressStr += '<br>' + _.escape(line3);
      addressStr += '<br>' + _.escape(line4);

      return this.sanitizer.bypassSecurityTrustHtml(addressStr);
    }
  }
}
