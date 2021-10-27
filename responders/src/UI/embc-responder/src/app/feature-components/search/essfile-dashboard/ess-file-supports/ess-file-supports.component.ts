import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ClothingReferral,
  FoodGroceriesReferral,
  FoodRestaurantReferral,
  IncidentalsReferral,
  LodgingBilletingReferral,
  LodgingGroupReferral,
  LodgingHotelReferral,
  Referral,
  Support,
  TransportationOtherReferral,
  TransportationTaxiReferral
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { EssfileDashboardService } from '../essfile-dashboard.service';
import { EssFileSupportsService } from './ess-file-supports.service';

@Component({
  selector: 'app-ess-file-supports',
  templateUrl: './ess-file-supports.component.html',
  styleUrls: ['./ess-file-supports.component.scss']
})
export class EssFileSupportsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren('matRef') matRef: QueryList<MatSelect>;
  supportList: Support[];
  supports = new MatTableDataSource([]);
  supports$: Observable<Support[]>;
  essFile: EvacuationFileModel;
  filtersToLoad: TableFilterModel;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private essFileSupportsService: EssFileSupportsService,
    private essfileDashboardService: EssfileDashboardService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          file: EvacuationFileModel;
        };
        this.essFile = state.file;
        this.supportList = state.file.supports.sort(
          (a, b) =>
            new Date(b.issuedOn).valueOf() - new Date(a.issuedOn).valueOf()
        );
      }
    }
  }

  ngOnInit(): void {
    this.supports = new MatTableDataSource(this.supportList);
    this.supports.paginator = this.paginator;
    this.supports$ = this.supports.connect();
    this.filtersToLoad = this.essFileSupportsService.load();
  }

  ngAfterViewInit(): void {
    this.supports.paginator = this.paginator;
    this.cd.detectChanges();
  }

  selected(event: MatSelectChange, filterType: string): void {
    this.resetFilter(filterType);
    const selectedValue =
      event.value === undefined || event.value === ''
        ? ''
        : event.value.description;
    const filterTerm = { type: filterType, value: selectedValue };
    this.filter(filterTerm);
  }

  resetFilter(filterType: string) {
    const selectRef = this.matRef.filter((select) => {
      return select.id !== filterType;
    });
    selectRef.forEach((select: MatSelect) => {
      select.value = '';
    });
  }

  /**
   * Filters the datatable
   *
   * @param term user selected filters
   */
  filter(term: TableFilterValueModel): void {
    this.supports.filterPredicate = this.supportFilterPredicate;
    this.supports.filter = JSON.stringify(term);

    if (this.supports.paginator) {
      this.supports.paginator.firstPage();
    }
  }

  supportFilterPredicate = (data: any, filter: string): boolean => {
    const searchString: TableFilterValueModel = JSON.parse(filter);
    if (searchString.type === 'status') {
      if (
        data.status
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1
      ) {
        return true;
      }
    } else if (searchString.type === 'type') {
      if (
        data.category
          .trim()
          .toLowerCase()
          .indexOf(searchString.value.trim().toLowerCase()) !== -1
      ) {
        return true;
      }
    }
  };

  getGroceryReferral(selectedSupport: Support): FoodGroceriesReferral {
    return selectedSupport as FoodGroceriesReferral;
  }

  getMealReferral(selectedSupport: Support): FoodRestaurantReferral {
    return selectedSupport as FoodRestaurantReferral;
  }

  getTaxiReferral(selectedSupport: Support): TransportationTaxiReferral {
    return selectedSupport as TransportationTaxiReferral;
  }

  getOtherReferral(selectedSupport: Support): TransportationOtherReferral {
    return selectedSupport as TransportationOtherReferral;
  }

  getHotelReferral(selectedSupport: Support): LodgingHotelReferral {
    return selectedSupport as LodgingHotelReferral;
  }

  getBilletingReferral(selectedSupport: Support): LodgingBilletingReferral {
    return selectedSupport as LodgingBilletingReferral;
  }

  getGroupReferral(selectedSupport: Support): LodgingGroupReferral {
    return selectedSupport as LodgingGroupReferral;
  }

  getIncidentalReferral(selectedSupport: Support): IncidentalsReferral {
    return selectedSupport as IncidentalsReferral;
  }

  getClothingReferral(selectedSupport: Support): ClothingReferral {
    return selectedSupport as ClothingReferral;
  }

  getReferral(selectedSupport: Support): Referral {
    return selectedSupport as Referral;
  }

  mapMemberName(memberId: string): string {
    const memberObject = this.essFile?.householdMembers.find((value) => {
      if (value?.id === memberId) {
        return value;
      }
    });
    return memberObject?.lastName + ',' + memberObject?.firstName;
  }

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      const category = this.essfileDashboardService.supportCategory.find(
        (value) => value.value === element?.category
      );
      return category?.description;
    } else {
      const subCategory = this.essfileDashboardService.supportSubCategory.find(
        (value) => value.value === element?.subCategory
      );
      return subCategory?.description;
    }
  }
}
