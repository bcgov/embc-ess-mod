import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  Support,
  Referral,
  SupportSubCategory,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  SupportStatus,
  Code,
  SupportMethod,
  SupportCategory,
  ClothingSupport,
  IncidentalsSupport,
  FoodGroceriesSupport
} from 'src/app/core/api/models';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import * as globalConst from '../../../../../core/services/global-constants';

@Component({
  selector: 'app-supports-table',
  templateUrl: './supports-table.component.html',
  styleUrls: ['./supports-table.component.scss']
})
export class SupportsTableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() supportList: Support[];
  @Input() showLoader: boolean;
  @Input() filterTerm: TableFilterValueModel;
  @Output() clickedRow = new EventEmitter<Support>(null);

  displayedColumns: string[] = [
    'id',
    'category',
    'from',
    'to',
    'supplierName',
    'totalAmount',
    'status'
  ];
  dataSource = new MatTableDataSource();
  color = '#169BD5';
  data: any;
  supportStatus: Code[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private loadEvacueeListService: LoadEvacueeListService
  ) {}

  /**
   * Listens to input events and popluate values
   *
   * @param changes input event change object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.supportList) {
      this.dataSource = new MatTableDataSource(this.supportList);

      this.dataSource.sortingDataAccessor = (item: Support, property) => {
        switch (property) {
          case 'supplierName':
            if (item.method === SupportMethod.ETransfer) {
              return item.method.toLowerCase();
            } else if (
              item.subCategory === SupportSubCategory.Lodging_Billeting
            ) {
              return (item as LodgingBilletingSupport).hostName.toLowerCase();
            } else if (item.subCategory === SupportSubCategory.Lodging_Group) {
              return (item as LodgingGroupSupport).facilityName.toLowerCase();
            } else {
              return (
                item.supportDelivery as Referral
              ).supplierName.toLowerCase();
            }
          default:
            return item[property];
        }
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cd.detectChanges();
    }

    if (changes.filterTerm && this.filterTerm !== undefined) {
      this.filter(this.filterTerm);
    }
  }

  ngOnInit(): void {
    this.supportStatus = this.loadEvacueeListService.getSupportStatus();
  }

  /**
   * Sets paginator and sort on tables
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Filters the datatable
   *
   * @param term user selected filters
   */
  filter(term: TableFilterValueModel): void {
    this.data = this.dataSource.filteredData;
    this.dataSource.filterPredicate = this.teamFilterPredicate;
    this.dataSource.filter = JSON.stringify(term);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  teamFilterPredicate = (data: any, filter: string): boolean => {
    const searchString: TableFilterValueModel = JSON.parse(filter);
    if (searchString.type === 'status') {
      //Two statuses have the same description, but different values
      //filter workaround so that the description selected can include multiple status values with the same description
      const possibleValues = this.supportStatus
        ?.filter((s) => s.description === searchString.value)
        .map((a) => a.value.trim().toLowerCase());
      if (
        possibleValues.length === 0 ||
        possibleValues.includes(data.status.trim().toLowerCase())
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

  /**
   * Captures the row click event
   *
   * @param row team member row
   */
  rowClicked(row): void {
    this.clickedRow.emit(row);
  }

  getExternalReferralId(element: Support): string {
    return (element.supportDelivery as Referral).manualReferralId;
  }

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      const category = this.loadEvacueeListService
        .getSupportCategories()
        .find((value) => value.value === element?.category);
      return category?.description;
    } else {
      const subCategory = this.loadEvacueeListService
        .getSupportSubCategories()
        .find((value) => value.value === element?.subCategory);
      return subCategory?.description;
    }
  }

  displaySupplierName(element: Support): string {
    if (element.method === SupportMethod.ETransfer) {
      return 'e-Transfer';
    }
    if (element.subCategory === SupportSubCategory.Lodging_Billeting) {
      return (element as LodgingBilletingSupport).hostName;
    } else if (element.subCategory === SupportSubCategory.Lodging_Group) {
      return (element as LodgingGroupSupport).facilityName;
    } else {
      return (element.supportDelivery as Referral).supplierName;
    }
  }

  getStatusDescription(status: SupportStatus) {
    return this.supportStatus?.find((s) => s.value === status)?.description;
  }

  checkExceedsRate(element: Support): boolean {
    let rate = Number.MAX_SAFE_INTEGER;
    switch (element?.category) {
      case SupportCategory.Clothing: {
        const clothingSupport = element as ClothingSupport;
        if (clothingSupport.extremeWinterConditions) {
          rate =
            globalConst.extremeConditions.rate *
            clothingSupport.includedHouseholdMembers.length;
        } else {
          rate =
            globalConst.normalConditions.rate *
            clothingSupport.includedHouseholdMembers.length;
        }
        return clothingSupport.totalAmount > rate;
      }
      case SupportCategory.Incidentals: {
        const incidentalsSupport = element as IncidentalsSupport;
        rate =
          globalConst.incidentals.rate *
          incidentalsSupport.includedHouseholdMembers.length;
        return incidentalsSupport.totalAmount > rate;
      }
      case SupportCategory.Food: {
        if (element?.subCategory === SupportSubCategory.Food_Groceries) {
          const foodGroceriesSupport = element as FoodGroceriesSupport;
          rate =
            globalConst.groceriesRate.rate *
            foodGroceriesSupport.includedHouseholdMembers.length *
            foodGroceriesSupport.numberOfDays;
          return foodGroceriesSupport.totalAmount > rate;
        } else {
          return false;
        }
      }
      default: {
        return false;
      }
    }
  }
}
