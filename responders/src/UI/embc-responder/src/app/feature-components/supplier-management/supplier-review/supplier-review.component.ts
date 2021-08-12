import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SupplierListDataService,
  SupplierTemp
} from '../suppliers-list/supplier-list-data.service';

@Component({
  selector: 'app-supplier-review',
  templateUrl: './supplier-review.component.html',
  styleUrls: ['./supplier-review.component.scss']
})
export class SupplierReviewComponent {
  selectedSupplier: SupplierTemp;
  reviewAction: string;
  showLoader = false;

  constructor(
    private supplierListDataService: SupplierListDataService,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        console.log(this.router.getCurrentNavigation().extras);
        const state = this.router.getCurrentNavigation().extras
          .state as SupplierTemp;
        this.selectedSupplier = state;

        const params = this.router.getCurrentNavigation().extras.queryParams;
        if (params) {
          this.reviewAction = params.action;
        }
      }
    } else {
      this.selectedSupplier = this.supplierListDataService.getSelectedSupplier();
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
        '/responder-access/responder-management/add-supplier'
      ]);
    }
  }

  /**
   * Saves changes done either on edit screen or adding a new supplier and navigates back to the supplier's detail page or the suppliers' list
   */
  save(): void {
    this.showLoader = !this.showLoader;
    if (this.selectedSupplier.id) {
      this.updateSupplier();
    } else {
      this.addSupplier();
    }
  }
  /**
   * Updates the selected supplier and navigates to team list
   */
  private updateSupplier(): void {
    // this.teamMemberReviewService
    //   .updateTeamMember(this.teamMember.id, this.teamMember)
    //   .subscribe(
    //     (value) => {
    const stateIndicator = { action: 'edit' };
    this.router.navigate(
      ['/responder-access/supplier-management/suppliers-list'],
      { state: stateIndicator }
    );
    //     },
    //     (error) => {
    //       this.showLoader = !this.showLoader;
    //       this.isSubmitted = !this.isSubmitted;
    //       if (error.title) {
    //         this.alertService.setAlert('danger', error.title);
    //       } else {
    //         this.alertService.setAlert('danger', error.statusText);
    //       }
    //     }
    //   );
  }

  /**
   * Adds a new Supplier and navigates to the suppliers' list
   */
  private addSupplier(): void {
    // this.teamMemberReviewService.addTeamMember(this.teamMember).subscribe(
    //   (value) => {
    const stateIndicator = { action: 'add' };
    this.router.navigate(
      ['/responder-access/supplier-management/suppliers-list'],
      { state: stateIndicator }
    );
    //   },
    //   (error) => {
    //     this.showLoader = !this.showLoader;
    //     this.isSubmitted = !this.isSubmitted;
    //     if (error.title) {
    //       this.alertService.setAlert('danger', error.title);
    //     } else {
    //       this.alertService.setAlert('danger', error.statusText);
    //     }
    //   }
    // );
  }
}
