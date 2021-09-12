import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EvacuationFileModel } from 'src/app/core/model/evacuation-file.model';
import { NeedsAssessmentMappingService } from '../../../../feature-components/needs-assessment/needs-assessment-mapping.service';
import { EvacuationFileDataService } from '../evacuation-file-data.service';
import { EvacuationFileMappingService } from '../evacuation-file-mapping.service';

@Component({
  selector: 'app-evacuation-card',
  templateUrl: './evacuation-card.component.html',
  styleUrls: ['./evacuation-card.component.scss']
})
export class EvacuationCardComponent implements OnInit {
  @Input() evacuationFileCard: EvacuationFileModel;
  @Input() evacuationFileStatus: string;

  imageIcon: string;
  pathName: string;

  constructor(
    private router: Router,
    private evacuationFileMapping: EvacuationFileMappingService
  ) {
    this.pathName = window.location.pathname;
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
    this.evacuationFileMapping.mapEvacuationFile(this.evacuationFileCard);

    if (this.pathName === '/verified-registration/dashboard/current') {
      this.router.navigate([
        '/verified-registration/dashboard/current/' +
          this.evacuationFileCard.fileId
      ]);
    } else {
      this.router.navigate([
        '/verified-registration/dashboard/past/' +
          this.evacuationFileCard.fileId
      ]);
    }
  }
}
