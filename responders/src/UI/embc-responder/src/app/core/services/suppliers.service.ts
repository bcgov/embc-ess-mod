/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { SupplierModel } from '../models/supplier.model';
import { LocationsService } from './locations.service';
import { SuppliersService, TeamsService } from '../api/services';
import { Observable } from 'rxjs/internal/Observable';
import {
  Supplier,
  SupplierListItem,
  SupplierResult,
  Team
} from '../api/models';
import { map, mergeMap } from 'rxjs/operators';
import { SupplierManagementService } from 'src/app/feature-components/supplier-management/supplier-management.service';
import { SupplierListItemModel } from '../models/supplier-list-item.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(
    private locationServices: LocationsService,
    private suppliersService: SuppliersService,
    private supplierManagementService: SupplierManagementService,
    private teamsService: TeamsService
  ) {}

  /**
   * Gives an array of Main Suppliers
   *
   * @returns an array of Main Supplier
   */
  getMainSuppliersList(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SupplierListItem>) => {
          return suppliers.filter((supplier) => {
            return supplier.isPrimarySupplier === true;
          });
        })
      );
  }

  /**
   * Gives an array of Mutual Aid Suppliers
   *
   * @returns an array of Mutual Aid Suppliers
   */
  getMutualAidSuppliersList(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map((suppliers: Array<SupplierListItem>) => {
          return suppliers.filter((supplier) => {
            return supplier.isPrimarySupplier === false;
          });
        })
      );
  }

  /**
   *
   * @param legalName supplier's legal name
   * @param gstNumber supplier's gst number
   * @returns an array of suppliers that match with the inserted input
   */
  checkSupplierExists(
    legalName?: string,
    gstNumber?: string
  ): Observable<Array<SupplierListItemModel>> {
    const suppliersItemsResult: Array<SupplierListItemModel> = [];
    return this.suppliersService
      .suppliersGetSuppliers({
        legalName,
        gstNumber
      })
      .pipe(
        map(
          (
            supplierItemsResult: Array<SupplierListItem>
          ): Array<SupplierListItemModel> => {
            supplierItemsResult.forEach((item) => {
              const supplierItem: SupplierListItemModel = {
                ...item,
                address: this.locationServices.getAddressModelFromAddress(
                  item.address
                )
              };
              suppliersItemsResult.push(supplierItem);
            });
            return suppliersItemsResult;
          }
        )
      );
  }

  /**
   * Allows to change the status of a supplier to active
   *
   * @param supplierId the supplier's ID
   * @returns an array of updated supplierListItem
   */
  activateSuppliersStatus(
    supplierId: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersActivateSupplier({
        supplierId
      })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getMainSuppliersList();
        })
      );
  }

  /**
   * Allows to change the status of a supplier de inactive
   *
   * @param supplierId the supplier's ID
   * @returns an array of updated supplierListItem
   */
  deactivateSuppliersStatus(
    supplierId: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersDeactivateSupplier({
        supplierId
      })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getMainSuppliersList();
        })
      );
  }

  /**
   * Gets the supplier's details based on the given ID
   *
   * @param supplierId the supplier's ID
   * @returns a SupplierModel object
   */
  getSupplierById(supplierId: string): Observable<SupplierModel> {
    return this.suppliersService.suppliersGetSupplierById({ supplierId }).pipe(
      map(
        (supplier: Supplier): SupplierModel => {
          const supplierModel = {
            ...supplier,
            supplierGstNumber: this.supplierManagementService.convertSupplierGSTNumberToFormModel(
              supplier.gstNumber
            ),
            address: this.locationServices.getAddressModelFromAddress(
              supplier.address
            )
          };

          return supplierModel;
        }
      )
    );
  }

  /**
   * Creates a new supplier in the ERA system
   *
   * @param supplierData new supplier's data
   * @returns new supplier's ID
   */
  createNewSupplier(supplierData: Supplier): Observable<SupplierResult> {
    return this.suppliersService.suppliersCreateSupplier({
      body: supplierData
    });
  }

  /**
   * Updates a selected supplier in the ERA system
   *
   * @param supplierId the supplier's ID
   * @param supplierData the supplier's new data
   * @returns updated supplier's ID
   */
  updateSupplier(
    supplierId: string,
    supplierData: Supplier
  ): Observable<SupplierResult> {
    return this.suppliersService.suppliersUpdateSupplier({
      supplierId,
      body: supplierData
    });
  }

  /**
   * Deletes the selected supplier and gives an updated list of main suppliers
   *
   * @param supplierId the supplier's ID to be deleted
   * @returns a list of main suppliers
   */
  deleteSupplier(supplierId: string): Observable<SupplierResult> {
    return this.suppliersService.suppliersRemoveSupplier({ supplierId });
  }

  /**
   * Claims a supplier without primary Team as Main supplier
   *
   * @param supplierId the supplier's id
   * @returns a list of main suppliers list
   */
  claimSupplier(supplierId: string): Observable<Array<SupplierListItem>> {
    return this.suppliersService.suppliersClaimSupplier({ supplierId }).pipe(
      mergeMap((result) => {
        console.log(result);
        return this.getMainSuppliersList();
      })
    );
  }

  /**
   * Get Mutual Aid ESS Team List
   *
   * @returns a list of ESS Team
   */
  getMutualAidByEssTeam(): Observable<Array<Team>> {
    return this.teamsService.teamsGetTeams();
  }

  /**
   * Gets Ess Teams by community code
   *
   * @param communityCode the community code which ESS Team belongs to
   * @returns a list of ESS Team
   */
  getMutualAidByCommunity(communityCode: string): Observable<Array<Team>> {
    return this.teamsService.teamsGetTeamsByCommunity({ communityCode });
  }

  /**
   * Adds a supplier as a mutual Aid to responders's current ESS Team
   *
   * @param supplierId supplier's ID
   * @param sharedTeamId responder's ESS Team ID
   * @returns a list of mutual aid suppliers
   */
  addMutualAidSupplier(
    supplierId: string,
    sharedTeamId: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersAddSupplierSharedWithTeam({ supplierId, sharedTeamId })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getMutualAidSuppliersList();
        })
      );
  }

  /**
   * Deletes a mutual aid supplier from responder's current ESS Team
   *
   * @param supplierId supplier's ID
   * @param sharedTeamId responder's ESS Team ID
   * @returns a list of mutual aid suppliers
   */
  rescindMutualAidSupplier(
    supplierId: string,
    sharedTeamId: string
  ): Observable<Array<SupplierListItem>> {
    return this.suppliersService
      .suppliersRemoveSupplierSharedWithTeam({ supplierId, sharedTeamId })
      .pipe(
        mergeMap((result) => {
          console.log(result);
          return this.getMutualAidSuppliersList();
        })
      );
  }
}
