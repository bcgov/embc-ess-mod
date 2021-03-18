import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFile } from 'src/app/core/api/models';
import { NeedsAssessmentMappingService } from '../../needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})

export class EvacuationCardComponent implements OnInit {

  @Input() evacuationFileCard: EvacuationFile;
  @Input() evacuationFileStatus: string;

  imageIcon: string;
  pathName: string;

  constructor(
    private router: Router, private evacuationFileDataService: EvacuationFileDataService,
    private needsAssessmentMappingService: NeedsAssessmentMappingService) {

    this.pathName = window.location.pathname;
    console.log(this.pathName);
  }

  ngOnInit(): void {
    this.changeStatusColor();
  }

  changeStatusColor(): void {
    if (this.evacuationFileStatus === 'Active') {
      this.imageIcon = '/assets/images/active_status.svg';
    } else {
      this.imageIcon = '/assets/images/inactive_status.svg';
    }
  }

  goToDetails(): void {

    this.evacuationFileDataService.evacuatedFromAddress = this.evacuationFileCard.evacuatedFromAddress;
    this.evacuationFileDataService.essFileNumber = this.evacuationFileCard.essFileNumber;
    this.evacuationFileDataService.evacuationFileStatus = this.evacuationFileStatus;
    this.needsAssessmentMappingService.setNeedsAssessment(this.evacuationFileCard.evacuatedFromAddress, this.evacuationFileCard.needsAssessments[0]);

    if (this.pathName === '/verified-registration/dashboard/current') {
      this.router.navigate(['/verified-registration/dashboard/current/' + this.evacuationFileCard.essFileNumber]);
    } else {
      this.router.navigate(['/verified-registration/dashboard/past/' + this.evacuationFileCard.essFileNumber]);
    }
  }

}
