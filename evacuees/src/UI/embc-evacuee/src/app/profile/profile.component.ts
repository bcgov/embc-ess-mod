import { Component, OnInit, Type, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCreationService } from '../core/services/componentCreation.service';
import { map, mergeMap } from 'rxjs/operators';
import { ComponentMetaDataModel } from '../model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  secondFormGroup: FormGroup;
  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  needsSteps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep: boolean = false;
  needsFolderPath: string = "needs-assessment-forms";
  profileFolderPath: string = "evacuee-profile-forms"
  @ViewChildren('profileStepper') private profileStepper: QueryList<MatStepper>;
  @ViewChild('needsStepper') private needsStepper: MatStepper;

  constructor(private _formBuilder: FormBuilder, private router: Router, private componentService: ComponentCreationService) {}

  ngOnInit() {
    this.steps = this.componentService.createProfileSteps();
    console.log(this.componentService.createProfileSteps());
    this.needsSteps = this.componentService.createEvacSteps();
  }

  createProfile(lastStep: boolean): void {
    if(lastStep) {
      this.showStep = !this.showStep;
      //this.router.navigate(['/create-evac-file']);
      //this.steps = this.componentService.createEvacSteps();
    }
  }

  goBack(stepper: MatStepper, lastStep): void {
    if(lastStep == 0) {
      stepper.previous();
      console.log(this.profileStepper)
    } else if(lastStep == -1) {
      this.showStep = !this.showStep;
      //stepper.selectedIndex
      this.profileStepper.changes.subscribe(x=> {
        console.log(x)
        x.first._selectedIndex = 3
      console.log(this.steps.length)
      //this.profileStepper.selectedIndex = 3;//this.steps.length;
      })
      
    } else if(lastStep = -2) {
      this.router.navigate(['/restriction'])
    }
  }

  goForward(stepper: MatStepper, isLast: boolean): void {
    if(isLast) {
      this.showStep = !this.showStep;
    }
    stepper.next();
  }

}


// firstFormGroup: FormGroup;
  // profileComponents$: Observable<any>;
  // profileComponents1: ComponentMetaDataModel;
    // this.profileComponents$ = this.componentService.getProfileComponents().pipe(mergeMap((components) => {
    //   return Promise.all(components.map(comp => {
    //     console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
    //     return import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
    //   }))
    // }));

    // this.profileComponents$.subscribe(x => {
    //   console.log(x)
    // })


    // this.profileComponents1 = this.componentService.getProfileComponents1().pipe(mergeMap((components) => {
    //   return Promise.all(components.map((comp) => {
    //     console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
    //      import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
    //   }))
    // }));

