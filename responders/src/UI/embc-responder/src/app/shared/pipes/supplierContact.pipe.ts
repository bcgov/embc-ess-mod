import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as _ from 'lodash';

@Pipe({ name: 'supplierContact' })
export class SupplierContactPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Converts contact info into sanitized 2-line format for display on pages.
   * Due to HTML sanitization, cannot be {{ interpolated }}, must use [innerHTML]
   *
   * @returns Sanitized Two-line SafeHTML string, <br> as only included HTML
   */
  transform(phoneNumber: string, email: string): SafeHtml {
    const line1 = phoneNumber;
    const line2 = email;

    // All values must be HTML-sanitized for us to include <br> line break.
    if (line1 !== null && line1.length > 0) {
      let contactStr = _.escape(line1);

      if (line2 !== null && line2.length > 0)
        contactStr += '<br>' + _.escape(line2);
      return this.sanitizer.bypassSecurityTrustHtml(contactStr);
    } else if (line1.length === 0 || line1 === null) {
      const contactStr = _.escape(line2);
      return this.sanitizer.bypassSecurityTrustHtml(contactStr);
    }
  }
}
