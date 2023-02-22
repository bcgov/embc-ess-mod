import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { SupplierService } from 'src/app/core/services/suppliers.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AddSupplierService } from '../add-supplier/add-supplier.service';
import { EditSupplierService } from '../edit-supplier/edit-supplier.service';
import { SupplierListDataService } from '../suppliers-list/supplier-list-data.service';

@Component({
  selector: 'app-supplier-review',
  templateUrl: './supplier-review.component.html',
  styleUrls: ['./supplier-review.component.scss']
})
export class SupplierReviewComponent {
  selectedSupplier: SupplierModel;
  reviewAction: string;
  showLoader = false;
  isSubmitted = false;

  constructor(
    private supplierListDataService: SupplierListDataService,
    private router: Router,
    private supplierService: SupplierService,
    private alertService: AlertService,
    private addSupplierService: AddSupplierService,
    private editSupplierService: EditSupplierService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras
          .state as SupplierModel;
        this.selectedSupplier = state;

        const params = this.router.getCurrentNavigation().extras.queryParams;
        if (params) {
          this.reviewAction = params.action;
        }
      }
    } else {
      this.selectedSupplier =
        this.supplierListDataService.getSelectedSupplier();
    }
  }

  /**
   * Goes back to the edit or add supplier's screen.
   */
  back(): void {
    if (this.selectedSupplier.id) {
      this.router.navigate(
        ['/responder-access/supplier-management/edit-supplier'],
        { state: this.selectedSupplier }
      );
    } else {
      this.router.navigate([
        '/responder-access/supplier-management/new-supplier'
      ]);
    }
  }

  /**
   * Saves changes done either on edit screen or adding a new supplier and navigates back to the supplier's detail page or the suppliers' list
   */
  save(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    if (this.selectedSupplier.id) {
      this.updateSupplier();
    } else {
      this.addSupplier();
    }
  }

  addExisting(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.supplierService.claimSupplier(this.selectedSupplier.id).subscribe({
      next: (value) => {
        this.showLoader = !this.showLoader;
        const stateIndicator = { action: 'add' };
        this.router.navigate(
          ['/responder-access/supplier-management/suppliers-list'],
          { state: stateIndicator }
        );
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.clearAlert();
        if (error.title) {
          this.alertService.setAlert('danger', error.title);
        } else {
          this.alertService.setAlert('danger', error.statusText);
        }
      }
    });
  }
  /**
   * Updates the selected supplier and navigates to team list
   */
  private updateSupplier(): void {
    this.supplierService
      .updateSupplier(
        this.editSupplierService.editedSupplier.id,
        this.editSupplierService.getEditedSupplierDTO()
      )
      .subscribe({
        next: (value) => {
          this.showLoader = !this.showLoader;
          const stateIndicator = { action: 'edit' };
          this.router.navigate(
            ['/responder-access/supplier-management/suppliers-list'],
            { state: stateIndicator }
          );
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          if (error.title) {
            this.alertService.setAlert('danger', error.title);
          } else {
            this.alertService.setAlert('danger', error.statusText);
          }
        }
      });
  }

  /**
   * Adds a new Supplier and navigates to the suppliers' list
   */
  private addSupplier(): void {
    this.supplierService
      .createNewSupplier(this.addSupplierService.getCreateSupplierDTO())
      .subscribe({
        next: (value) => {
          this.showLoader = !this.showLoader;
          const stateIndicator = { action: 'add' };
          this.router.navigate(
            ['/responder-access/supplier-management/suppliers-list'],
            { state: stateIndicator }
          );
        },
        error: (error) => {
          this.showLoader = !this.showLoader;
          this.isSubmitted = !this.isSubmitted;
          this.alertService.clearAlert();
          if (error.title) {
            this.alertService.setAlert('danger', error.title);
          } else {
            this.alertService.setAlert('danger', error.statusText);
          }
        }
      });
  }
}
