import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evacuation-file',
  templateUrl: './evacuation-file.component.html',
  styleUrls: ['./evacuation-file.component.scss']
})
export class EvacuationFileComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;

  constructor(private _formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  reviewSubmission() {
    this.router.navigate(['/review']);
  }

}
