import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {

    constructor(private router: Router, public dialog: MatDialog) { }

    addEvacuationFile(city: string): void {
        this.dialog.open(DialogComponent, {
            data: {
                title: 'Add Another Evacuation File',
                body: '<p>We have you as currently evacuated from <span class="highlight">' + city + '</span>, has your situation changed?</p>',
                buttons:
                    [
                        {
                            name: 'No, Cancel',
                            class: 'button-s',
                            function: 'close'
                        },
                        {
                            name: 'Yes, Continue',
                            class: 'button-p',
                            function: 'add'
                        }
                    ]
            },
            height: '252px',
            width: '699px'
        }).afterClosed().subscribe(result => {
            if (result === 'add') {
                this.router.navigate(['/verified-registration/confirm-restriction']);
            }
        });
    }

    submissionCompleteDialog(referenceNumber: string): void {
        this.dialog.open(DialogComponent, {
            data: {
                title: 'Submission Complete',
                body: '<p class = "highlightSubtitle"> Your Emergency Support Services (ESS) File Number is: ' + referenceNumber + '</p><p>Thank you for submitting your online self-registration.</p><p class="highlight">Next Steps</p><p>Please keep a record of your Emergency Support Services File Number to receive emergency support services that can be provided up to 72 hours starting from the time connecting in with a local ESS Responder at a Reception Centre.</p><p>After a needs assessment interview with a local ESS Responder has been completed, supports are provided to purchase goods and services if eligible.</p><p>Any goods and services purchased prior to a need\'s assessment interview are not eligible for retroactive reimbursement.</p><br><p>If you are under <b>EVACUATION ALERT</b> or <b>DO NOT</b> require emergency serves at this time, no further action is required.</p><br><p><p>If you are under <b>EVACUATION ORDER</b>, and require emergency supports, proceed to the area designated by your local ESS team or your nearest Reception Centre. A list of open Reception Centres can be found at <a class="highlightText" href="https://www.emergencyinfobc.gov.bc.ca/" target="_blank">Emergency Info BC</a>.</p></p><p>If NO nearby Reception Centre is open and immediate action is required, please contact your First Nation Government or Local Authority for next steps.</p>',
                buttons:
                    [
                        {
                            name: 'Close',
                            class: 'button-p',
                            function: 'close'
                        }
                    ]
            },
            height: '800px',
            width: '800px'
        });
    }

    dateOfBirthMismatch(eraDob: string, bcscDob: string): void {
        this.dialog.open(DialogComponent, {
            data: {
                title: 'BC Services Card Mismatch',
                body: '<div class="row"><p>The date of birth attached to your BC Services card <b>does not match</b> the date of birth associated with your ERA Profile. By clicking <span class="highlight">Continue</span> your details in your ERA Profile will be updated to match the details associated with your BC Services card.</p></div><br><div class="row justify-content-between"><div class="highlight-conflicts">Evacuee Registration & Assistance (ERA)</div><div class="highlight">BC Services Card</div></div><div class="row justify-content-between"><div>' + eraDob + '</div><div>' + bcscDob + '</div></div>',
                buttons:
                    [
                        {
                            name: 'Continue',
                            class: 'button-p',
                            function: 'close'
                        }
                    ]
            },
            height: '352px',
            width: '699px'
        })
    }
}

