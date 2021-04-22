import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';
import { EvacueeSearchService } from '../evacuee-search.service';

@Component({
  selector: 'app-evacuee-id-verify',
  templateUrl: './evacuee-id-verify.component.html',
  styleUrls: ['./evacuee-id-verify.component.scss']
})

export class EvacueeIdVerifyComponent implements OnInit {

  @Output() showIDPhotoComponent = new EventEmitter<boolean>();

  idVerifyForm: FormGroup;
  evacueeSearchContextModel: EvacueeSearchContextModel;

  panel1OpenState = false;
  panel2OpenState = false;

  constructor(private builder: FormBuilder, private evacueeSearchService: EvacueeSearchService) { }

  ngOnInit(): void {
    this.constructIdVerifyForm();
  }

  get idVerifyFormControl(): { [key: string]: AbstractControl; } {
    return this.idVerifyForm.controls;
  }

  constructIdVerifyForm(): void {
    this.idVerifyForm = this.builder.group({
      photoId: [this.evacueeSearchContextModel?.hasShownIdentification, [Validators.required]]
    });
  }

  next() {
    if(this.idVerifyForm.status == 'VALID') {
      console.log(this.idVerifyForm.get('photoId').value)
      this.evacueeSearchService.hasShownIdentification = this.idVerifyForm.get('photoId').value;
      this.showIDPhotoComponent.emit(false);
    } else {
      this.idVerifyForm.markAllAsTouched();
    }
  }
}
