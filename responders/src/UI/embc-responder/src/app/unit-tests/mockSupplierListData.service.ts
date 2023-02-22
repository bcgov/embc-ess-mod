import { Injectable } from '@angular/core';
import { CommunityType, SupplierStatus } from '../core/api/models';
import { SupplierModel } from '../core/models/supplier.model';
import { SupplierListDataService } from '../feature-components/supplier-management/suppliers-list/supplier-list-data.service';

@Injectable({ providedIn: 'root' })
export class MockSupplierListDataService extends SupplierListDataService {
  public mockSupplier: SupplierModel = {
    id: '03d0a11b-99a4-4c4a-8f97-2f39d3500972',
    name: 'Tests',
    legalName: 'test supplier',
    gstNumber: '343455466-RT-6767',
    address: {
      community: {
        code: '7669dfaf-9f97-ea11-b813-005056830319',
        name: 'Armstrong',
        districtName: 'North Okanagan',
        stateProvinceCode: 'BC',
        countryCode: 'BC',
        type: CommunityType.City
      },
      country: {
        code: 'CAN',
        name: 'Canada'
      },
      stateProvince: {
        code: 'BC',
        name: 'British Columbia',
        countryCode: 'CAN'
      },
      addressLine1: 'Addressline 1',
      addressLine2: null,
      city: null,
      communityCode: '7669dfaf-9f97-ea11-b813-005056830319',
      stateProvinceCode: 'BC',
      countryCode: 'CAN',
      postalCode: 'v0v0v0'
    },
    contact: {
      firstName: 'Test',
      lastName: 'Smoke',
      phone: '123-234-3244',
      email: null
    },
    primaryTeams: [
      {
        id: '08cab1d6-dd73-ec11-b830-00505683fbf4',
        name: 'DEV Team',
        isActive: true
      }
    ],

    status: SupplierStatus.Active,
    supplierGstNumber: {
      part1: '343455466',
      part2: '6767'
    }
  };

  public getSelectedSupplier(): SupplierModel {
    return this.mockSupplier;
  }

  /**
   * Sets a selected supplier
   *
   * @param selectedSupplier
   */
  public setSelectedSupplier(selectedSupplier: SupplierModel) {
    this.mockSupplier = selectedSupplier;
  }
}
