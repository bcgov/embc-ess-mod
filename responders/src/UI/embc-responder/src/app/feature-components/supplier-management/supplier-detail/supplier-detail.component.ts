import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import {
  SupplierListDataService,
  SupplierTemp
} from '../suppliers-list/supplier-list-data.service';
import { MemberRole } from 'src/app/core/api/models';
import * as globalConst from '../../../core/services/global-constants';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent implements OnInit {
  searchMutualAidForm: FormGroup;
  selectedSupplier: SupplierTemp;
  loggedInRole: string;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private supplierListDataService: SupplierListDataService,
    private userService: UserService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        console.log(this.router.getCurrentNavigation().extras.state);
        const state = this.router.getCurrentNavigation().extras
          .state as SupplierTemp;
        this.selectedSupplier = state;
      }
    } else {
      this.selectedSupplier = this.supplierListDataService.selectedSupplier;
    }
  }

  ngOnInit(): void {
    this.loggedInRole = this.userService.currentProfile.role;
    this.createSearchMutualAidForm();
    console.log(this.selectedSupplier);
    console.log(this.supplierListDataService.selectedSupplier);
  }

  /**
   * Opens the delete confirmation modal, deletes the team member and
   * navigates to team member list
   */
  deleteSupplier(): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.deleteSupplierFromList
        },
        height: '300px',
        width: '650px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          //       this.teamDetailsService
          //         .deleteTeamMember(this.teamMember.id)
          //         .subscribe((value) => {
          //           const stateIndicator = { action: 'delete' };
          this.router.navigate(
            ['/responder-access/supplier-management/suppliers-list']
            // { state: stateIndicator }
          );
          // });
        }
      });
  }

  /**
   * Navigates to edit team member component
   */
  editSupplier(): void {
    this.router.navigate(
      ['/responder-access/supplier-management/edit-supplier'],
      { state: this.selectedSupplier }
    );
  }

  /**
   * According to the user's accesss, displays the mutual Aid section
   *
   * @returns true or false to show the mutual aid section.
   */
  showMutualAid(): boolean {
    if (
      this.loggedInRole === MemberRole.Tier4 ||
      this.loggedInRole === MemberRole.Tier3
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Builds the form to search for Mutual Aid Suppliers
   */
  private createSearchMutualAidForm(): void {
    this.searchMutualAidForm = this.builder.group({
      essTeam: [''],
      community: ['']
    });
  }
}
