import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from '../../../core/services/formCreation.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  componentToLoad: Observable<any>;
  cs: any;

  constructor(private router: Router, public formCreationService: FormCreationService) { }

  hideCard = false;
  captchaVerified = false;
  captchaFilled = false;
  navigationExtras: NavigationExtras;
  @Output() captchaPassed = new EventEmitter<boolean>(false);
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;

  ngOnInit(): void {
    this.navigationExtras = { state: { parentPageName: this.parentPageName } };
    if (this.currentFlow === 'verified-registration') {
      this.captchaPassed.emit(true);
    }
  }

  editDetails(componentToEdit: string): void {
    let route: string;
    if (this.currentFlow === 'non-verified-registration') {
      route = '/non-verified-registration/edit/' + componentToEdit;
    } else {
      route = '/verified-registration/edit/' + componentToEdit;
    }
    this.router.navigate([route], this.navigationExtras);
  }

  back(): void {
    this.hideCard = false;
  }

  public onValidToken(token: any): void {
    console.log('Valid token received: ', token);
    this.captchaVerified = true;
    this.captchaFilled = true;
    this.captchaPassed.emit(true);
  }

  public onServerError(error: any): void {
    console.log('Server error: ', error);
    this.captchaVerified = true;
    this.captchaFilled = true;
  }
}
