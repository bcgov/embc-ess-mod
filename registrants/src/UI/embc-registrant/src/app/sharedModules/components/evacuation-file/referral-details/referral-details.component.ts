import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  LodgingBilletingReferral,
  LodgingGroupReferral,
  Referral,
  Support
} from 'src/app/core/api/models';
import { NeedsAssessmentService } from 'src/app/feature-components/needs-assessment/needs-assessment.service';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class ReferralDetailsComponent implements OnInit {
  @Input() referralDataSource: Support[];
  @Input() referralsDate: string;
  @Input() allExpandState: boolean;

  panelOpenState = false;
  columnsToDisplay = ['provider', 'type', 'issuedTo', 'referral', 'amount'];
  expandedElement: Support | null;

  constructor(
    private needsAssessmentService: NeedsAssessmentService,
    private locationService: LocationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  getReferral(support: Support): Referral {
    return support as Referral;
  }

  getBilletingReferral(support: Support): LodgingBilletingReferral {
    return support as LodgingBilletingReferral;
  }

  getGroupReferral(support: Support): LodgingGroupReferral {
    return support as LodgingGroupReferral;
  }

  /**
   * Returns the full name of the igiven householmember ID
   *
   * @param memberId the member ID
   * @returns the Full LAST NAME, First Name of the given household member ID
   */
  getMemberFullName(memberId: string): string {
    const lastName = this.needsAssessmentService.householdMembers.find(
      (member) => member.id === memberId
    ).details?.lastName;
    const firstName = this.needsAssessmentService.householdMembers.find(
      (member) => member.id === memberId
    ).details?.firstName;

    return firstName + ', ' + lastName;
  }

  generateSupportType(element: Support): string {
    if (element?.subCategory === 'None') {
      const category = this.locationService.supportCategory.find(
        (value) => value.value === element?.category
      );
      return category?.description;
    } else {
      const subCategory = this.locationService.supportSubCategory.find(
        (value) => value.value === element?.subCategory
      );
      return subCategory?.description;
    }
  }
}
