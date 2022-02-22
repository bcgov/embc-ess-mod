import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RegAddress } from '../model/address';
import { Community, LocationService } from '../services/location.service';
import * as _ from 'lodash';

@Pipe({ name: 'maskEvacuatedaddress' })
export class MaskEvacuatedAddressPipe implements PipeTransform {
  constructor(
    private locationService: LocationService,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Converts Address object into sanitized 2-line format for display on pages.
   * Due to HTML sanitization, cannot be {{ interpolated }}, must use [innerHTML]
   *
   * @param address Address object to display on page
   * @returns Sanitized Two-line SafeHTML string, <br> as only included HTML
   */
  transform(address: RegAddress): SafeHtml {
    if (address !== null && address !== undefined) {
      const communities = this.locationService.getCommunityList();

      let line1 = address.addressLine1;
      let line2 = '';

      if (address.addressLine2?.length > 0)
        line1 += ', ' + address.addressLine2;

      const communityName = (address.community as Community)?.name ?? '';

      // Only set line 2 if city exists
      if (communityName.length > 0) {
        line2 = communityName;

        if (address.postalCode?.length > 0) line2 += ', ' + address.postalCode;
      }

      // All values must be HTML-sanitized for us to include <br> line break.
      let addressStr = _.escape(line1);

      if (line2.length > 0) addressStr += '<br>' + _.escape(line2);

      return this.sanitizer.bypassSecurityTrustHtml(addressStr);
    }
  }
}
