import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { DataService } from '../../../core/services/data.service';
import * as globalConst from '../../../core/services/globalConstants';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit {

  collectionForm: FormGroup;
  currentFlow: string;

  constructor(private router: Router, public dialog: MatDialog, private builder: FormBuilder, public dataService: DataService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.collectionForm = this.builder.group({
      informationCollectionConsent: [false]
    });
    this.mapData();
  }

  mapData(): void {
    const existingValues = this.dataService.getRegistration();
    if (existingValues !== null) {
      this.collectionForm.get('informationCollectionConsent').setValue(existingValues.informationCollectionConsent);
    }
  }

  submitNotice(): void {
    if (!this.collectionForm.get('informationCollectionConsent').value) {
      this.dialog.open(DialogComponent, {
        data: globalConst.noticeBody,
        height: '198px',
        width: '500px'
      });
    } else {
      this.dataService.updateRegistartion(this.collectionForm.value);
      let navigationPath = '/' + this.currentFlow + '/restriction'
      this.router.navigate([navigationPath]);
    }
  }

}
