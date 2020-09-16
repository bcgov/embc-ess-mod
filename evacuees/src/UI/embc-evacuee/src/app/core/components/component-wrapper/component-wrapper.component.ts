import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-component-wrapper',
  templateUrl: './component-wrapper.component.html',
  styleUrls: ['./component-wrapper.component.scss']
})
export class ComponentWrapperComponent implements OnInit {

  @Input() componentName: string;
  @Input() folderPath: string;
  loadedComponent: any;

  constructor() { }

  ngOnInit(): void {
    from(this.loadProfileComponent()).subscribe(module => {
      this.loadedComponent = module.default;
    });
  }

  loadProfileComponent(): Promise<any> {
    return Promise.resolve(import(`../${this.folderPath}/${this.componentName}/${this.componentName}.component`));
  }
// ../core/components/evacuee-profile-forms/${this.componentName}/${this.componentName}.component`
}
