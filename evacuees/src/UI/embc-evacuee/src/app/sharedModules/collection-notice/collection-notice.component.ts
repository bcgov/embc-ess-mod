import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-collection-notice',
  templateUrl: './collection-notice.component.html',
  styleUrls: ['./collection-notice.component.scss']
})
export class CollectionNoticeComponent implements OnInit {

  collectionForm: FormGroup;

  // informationCollectionConsent = new FormControl(false);
  body = {
    body: 'To register with the Evacuee Registration & Assistance (ERA) tool, you must select \'I agree\'.',
    buttons:
      [
        {
          name: 'Close',
          class: 'button-p',
          function: 'close'
        }
      ]
  };

  constructor(private router: Router, public dialog: MatDialog, private builder: FormBuilder, public dataService: DataService) { }

  ngOnInit(): void {
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
        data: this.body,
        height: '198px',
        width: '500px'
      });
    } else {
      this.dataService.updateRegistartion(this.collectionForm.value);
      this.router.navigate(['/non-verified-registration/restriction']);
    }
  }

}
