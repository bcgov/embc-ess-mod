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
  ClothingSupport,
  Code,
  FoodGroceriesSupport,
  FoodRestaurantSupport,
  IncidentalsSupport,
  LodgingBilletingSupport,
  LodgingGroupSupport,
  LodgingHotelSupport,
  Referral,
  Support,
  SupportMethod,
  SupportStatus,
  TransportationOtherSupport,
  TransportationTaxiSupport
} from 'src/app/core/api/models';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { TableFilterValueModel } from 'src/app/core/models/table-filter-value.model';
import { TableFilterModel } from 'src/app/core/models/table-filter.model';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
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
  supportMethod = SupportMethod;
  supportStatus: Code[] = [];

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private essFileSupportsService: EssFileSupportsService,
    private loadEvacueeListService: LoadEvacueeListService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          file: EvacuationFileModel;
        };
        this.essFile = state.file;
        this.supportList = state.file?.supports?.sort(
          (a, b) =>
            new Date(b.issuedOn).valueOf() - new Date(a.issuedOn).valueOf()
        );

        this.supportList.forEach((support) => {
          support.includedHouseholdMembers.sort(
            (a, b) =>
              this.essFile?.householdMembers.findIndex((m) => m.id === a) -
              this.essFile?.householdMembers.findIndex((m) => m.id === b)
          );
        });
      }
    }
  }

  ngOnInit(): void {
    this.supports = new MatTableDataSource(this.supportList);
    this.supports.paginator = this.paginator;
    this.supports$ = this.supports.connect();
    this.filtersToLoad = this.essFileSupportsService.load();
    this.supportStatus = this.loadEvacueeListService.getSupportStatus();
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

  getStatusDescription(status: SupportStatus) {
    return this.supportStatus?.find((s) => s.value === status)?.description;
  }

  getExternalReferralId(element: Support): string {
    return (element.supportDelivery as Referral).manualReferralId;
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

  getGroceryReferral(selectedSupport: Support): FoodGroceriesSupport {
    return selectedSupport as FoodGroceriesSupport;
  }

  getMealReferral(selectedSupport: Support): FoodRestaurantSupport {
    return selectedSupport as FoodRestaurantSupport;
  }

  getTaxiReferral(selectedSupport: Support): TransportationTaxiSupport {
    return selectedSupport as TransportationTaxiSupport;
  }

  getOtherReferral(selectedSupport: Support): TransportationOtherSupport {
    return selectedSupport as TransportationOtherSupport;
  }

  getHotelReferral(selectedSupport: Support): LodgingHotelSupport {
    return selectedSupport as LodgingHotelSupport;
  }

  getBilletingReferral(selectedSupport: Support): LodgingBilletingSupport {
    return selectedSupport as LodgingBilletingSupport;
  }

  getGroupReferral(selectedSupport: Support): LodgingGroupSupport {
    return selectedSupport as LodgingGroupSupport;
  }

  getIncidentalReferral(selectedSupport: Support): IncidentalsSupport {
    return selectedSupport as IncidentalsSupport;
  }

  getClothingReferral(selectedSupport: Support): ClothingSupport {
    return selectedSupport as ClothingSupport;
  }

  getReferral(selectedSupport: Support): Referral {
    return selectedSupport.supportDelivery as Referral;
  }

  mapMemberName(memberId: string): string {
    const memberObject = this.essFile?.householdMembers.find((value) => {
      if (value?.id === memberId) {
        return value;
      }
    });
    return memberObject?.firstName;
  }

  mapMemberLastName(memberId: string): string {
    const memberObject = this.essFile?.householdMembers.find((value) => {
      if (value?.id === memberId) {
        return value;
      }
    });
    return memberObject?.lastName;
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
}
