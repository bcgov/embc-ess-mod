import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-evacuee-id-verify',
  templateUrl: './evacuee-id-verify.component.html',
  styleUrls: ['./evacuee-id-verify.component.scss']
})

export class EvacueeIdVerifyComponent implements OnInit {

  @Output() showIDPhotoComponent = new EventEmitter<boolean>();

  panel1OpenState = false;
  panel2OpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.showIDPhotoComponent.emit(false);
  }
}
