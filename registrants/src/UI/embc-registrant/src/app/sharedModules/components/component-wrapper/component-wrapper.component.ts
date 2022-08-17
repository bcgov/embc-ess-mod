import { Component, OnInit, Input, Injector } from '@angular/core';
import { from } from 'rxjs';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { FormCreationService } from '../../../core/services/formCreation.service';

@Component({
  selector: 'app-component-wrapper',
  templateUrl: './component-wrapper.component.html',
  styleUrls: ['./component-wrapper.component.scss']
})
export class ComponentWrapperComponent implements OnInit {
  @Input() componentName: string;
  @Input() folderPath: string;
  loadedComponent: any;
  serviceInjector: Injector;

  constructor(
    private injector: Injector,
    private formBuilder: UntypedFormBuilder,
    private formCreationService: FormCreationService
  ) {}

  /**
   * Initializes the services and loads the component to
   * the view
   */
  ngOnInit(): void {
    if (!this.loadedComponent) {
      this.serviceInjector = Injector.create({
        providers: [
          {
            provide: 'formBuilder',
            useValue: this.formBuilder
          },
          {
            provide: 'formCreationService',
            useValue: this.formCreationService
          }
        ],
        parent: this.injector
      });
    }
    from(this.loadComponent()).subscribe((module) => {
      this.loadedComponent = module.default;
    });
  }

  /**
   * Imports the component
   */
  loadComponent(): Promise<any> {
    return Promise.resolve(
      import(
        `../../forms/${this.folderPath}/${this.componentName}/${this.componentName}.component`
      )
    );
  }
}
