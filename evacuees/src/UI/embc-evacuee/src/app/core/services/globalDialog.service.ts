import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';

@Injectable({ providedIn: 'root' })
export class GlobalDialogService {

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
                body: '<p class = "highlightSubtitle"> Your Emergency Support Services (ESS) File Number is: ' + referenceNumber + '</p><p>Thank you for submitting your online self-registration.</p><p class="highlight">Next Steps</p><p>Please keep a record of your Emergency Support Services File Number to receive emergency support services that can be provided up to 72 hours starting from the time connecting in with a local ESS Responder at a Reception Centre.</p><p>After a needs assessment interview with a local ESS Responder has been completed, supports are provided to purchase goods and services if eligible.</p><p>Any goods and services purchased prior to a need\'s assessment interview are not eligible for retroactive reimbursement.</p><br><p>If you are under <b>EVACUATION ALERT</b> or <b>DO NOT</b> require emergency serves at this time, no further action is required.</p><br><p>If you are under <b>EVACUATION ORDER</b>, and require emergency supports, proceed to the area designated by your local ESS team or your nearest Reception Centre. A list of open Reception Centres can be found at <span class="highlightText">Emergency Info BC</span>.</p><p>If NO nearby Reception Centre is open and immediate action is required, please contact your First Nation Government or Local Authority for next steps.</p>',
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
}

