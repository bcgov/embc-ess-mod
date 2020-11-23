import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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
  @Output() captchaPassed = new EventEmitter<boolean>(false);
  @Input() type: string;
  @Input() showHeading: boolean;

  ngOnInit(): void {
    // this.loadComponent();

    // this.componentToLoad.subscribe(x => {
    //   console.log(x)
    //   this.cs = x.default;
    // })
  }

  editDetails(componentToEdit: string): void {
    const route = '/non-verified-registration/edit/' + componentToEdit;
    this.router.navigate([route]);
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

  // loadComponent() {
  // if(!this.componentToLoad) {
  //  this.componentToLoad = this.componentService.getProfileComponents().pipe(
  //    map(comps => comps.filter( v => v.type === 'personal-details')[0])

  //    ).pipe(mergeMap((x) => {
  //   console.log(x)
  //   console.log(x.type)
  //   console.log((`../core/components/evacuee-profile-forms/${x.type}/${x.type}.component`))
  //   return Promise.resolve(import(`../core/components/evacuee-profile-forms/${x.type}/${x.type}.component`));
  //  return Promise.resolve(x => {
  //    console.log("here")
  //   console.log(x)
  //    return import(`../core/components/evacuee-profile-forms/${x.type}/${x.type}.component`);
  //  }
  //  }));

  // compName.subscribe(v => console.log(v))


  // console.log(comp)
  //     console.log(comp.type === "personal-details")
  //     return comp.type === 'personal-details'}));


  //  this.componentToLoad = Promise.resolve(compName => {
  //    return import(`../core/components/evacuee-profile-forms/${compName}/${compName}.component`);
  //   })
  // }
  // }

}


  // this.profileComponents$ = this.componentService.getProfileComponents().pipe(mergeMap((components) => {
  //     return Promise.all(components.map(comp => {
  //       console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
  //       return import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
  //     }))
  //   }));



  // mergeMap((components) => {
  //       return Promise.all(components.map(comp => {
  //         console.log((`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`));
  //         return import(`../core/components/evacuee-profile-forms/${comp.type}/${comp.type}.component`);
  //       }))
  //     }));

