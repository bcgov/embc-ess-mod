import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-referral',
    templateUrl: './referral.component.html',
    styleUrls: ['./referral.component.scss']
})
export class ReferralComponent {

    @Input() formGroupName: number;
    @Input() referralForm: FormGroup

}