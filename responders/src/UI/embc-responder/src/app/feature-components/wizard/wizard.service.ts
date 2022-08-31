import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pet, SecurityQuestion } from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { TabStatusManager } from 'src/app/core/models/tab.model';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { Community } from 'src/app/core/services/locations.service';
import * as _ from 'lodash';
import * as globalConst from '../../core/services/global-constants';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Injectable({ providedIn: 'root' })
export class WizardService {
  public editStatus: BehaviorSubject<TabStatusManager[]> = new BehaviorSubject<
    TabStatusManager[]
  >([]);
  public editStatus$: Observable<TabStatusManager[]> =
    this.editStatus.asObservable();
  private sideMenuItems: Array<WizardSidenavModel>;
  private profileObjectReference: RegistrantProfileModel;
  private fileObjectReference: EvacuationFileModel;

  constructor(
    private cacheService: CacheService,
    private router: Router,
    private dialog: MatDialog,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  public get menuItems(): Array<WizardSidenavModel> {
    if (this.sideMenuItems === null || this.sideMenuItems === undefined)
      this.sideMenuItems = JSON.parse(this.cacheService.get('wizardMenu'));

    return this.sideMenuItems;
  }
  public set menuItems(menuItems: Array<WizardSidenavModel>) {
    this.sideMenuItems = menuItems;
    this.cacheService.set('wizardMenu', menuItems);
  }

  /**
   * Constructs the first step to be loaded by the wizard
   */
  loadDefaultStep(sideNavMenu: Array<WizardSidenavModel>): void {
    if (sideNavMenu !== null && sideNavMenu !== undefined) {
      const firstStepUrl = sideNavMenu[0].route;
      const firstStepId = sideNavMenu[0].step;
      const firstStepTitle = sideNavMenu[0].title;

      this.router.navigate([firstStepUrl], {
        state: { step: firstStepId, title: firstStepTitle }
      });
    }
  }

  /**
   * Opens exit modal window
   *
   * @param navigateTo navigateTo url
   */
  openExitModal(navigateTo: string): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content: globalConst.exitWizardDialog
        },
        width: '530px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate([navigateTo]);
        }
      });
  }

  /**
   * Allows navigation if the step is not locked else
   * displays modal window
   *
   * @param lockedIndicator
   * @param $event
   */
  manageStepNavigation(
    lockedIndicator: boolean,
    $event: MouseEvent,
    targetRoute: string
  ): void {
    const curStep = this.getCurrentStep(this.router.url);
    if (lockedIndicator) {
      $event.stopPropagation();
      $event.preventDefault();

      const lockedMsg =
        this.menuItems[curStep]?.incompleteMsg ||
        globalConst.stepIncompleteMessage;

      this.openLockedModal(lockedMsg);
    } else if (
      !lockedIndicator &&
      (this.router.url === '/ess-wizard/add-supports/details' ||
        this.router.url === '/ess-wizard/add-supports/delivery')
    ) {
      $event.stopPropagation();
      $event.preventDefault();

      this.openWarningModal(globalConst.supportInProgressMessage, targetRoute);
    }
  }

  /**
   * Opens information modal to display the step
   * locked message
   *
   * @param text message to display
   */
  openLockedModal(content: DialogContent, title?: string) {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content,
        title
      },
      width: '530px'
    });
  }

  /**
   * Opens information modal to display the support step
   * warning message
   *
   * @param text message to display
   */
  openWarningModal(content: DialogContent, navigateTo: string) {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: InformationDialogComponent,
          content
        },
        width: '530px'
      })
      .afterClosed()
      .subscribe((event) => {
        if (event === 'confirm') {
          this.router.navigate([navigateTo]);
        }
      });
  }

  public setEditStatus(value: TabStatusManager) {
    const currentValue = this.editStatus.value;
    let updatedValue = [];
    for (const tab of currentValue) {
      if (tab.tabName === value.tabName) {
        const removeIndex = currentValue.indexOf(tab);
        currentValue.splice(removeIndex, 1);
      }
    }
    updatedValue = [...currentValue, value];
    this.editStatus.next(updatedValue);
  }

  /**
   * Return the index of current step of the wizard, based on the submitted URL
   *
   * @param url URL of current page, typically retrieved from this.router.url
   */
  public getCurrentStep(currentUrl: string): number {
    currentUrl = currentUrl.toLowerCase();
    return this.menuItems.findIndex((mi) =>
      currentUrl.startsWith(mi.route.toLowerCase())
    );
  }

  public setStepStatus(name: string, status: boolean): void {
    this.menuItems?.map((menu) => {
      if (menu?.route === name) {
        menu.isLocked = status;
      }
      return menu;
    });
  }

  /**
   * Map an address from the API to an address usable by the wizard form
   *
   * @param addressObject AddressModel object with nested objects set by UI code
   * @returns An Address that can be filled into the site's address forms
   */
  public setAddressObjectForForm(addressObject: AddressModel): AddressModel {
    const address: AddressModel = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country,
      postalCode: addressObject.postalCode,
      stateProvince: addressObject.stateProvince,
      community:
        addressObject.city !== null
          ? addressObject.city
          : addressObject.community
    };

    return address;
  }

  createObjectReference<
    T extends RegistrantProfileModel,
    X extends EvacuationFileModel
  >(originalValue: T | X, type: string): void {
    if (type === 'profile') {
      this.profileObjectReference = Object.assign(
        {},
        originalValue as RegistrantProfileModel
      );
    } else if (type === 'file') {
      this.fileObjectReference = Object.assign(
        {},
        originalValue as EvacuationFileModel
      );
    }
  }

  hasChanged(form: { [key: string]: AbstractControl }, type: string): boolean {
    if (
      this.profileObjectReference !== null &&
      this.profileObjectReference !== undefined &&
      (type === 'personalDetails' || type === 'contactDetails')
    ) {
      const initialValue = (
        this.profileObjectReference as RegistrantProfileModel
      )[type];
      return Object.keys(initialValue).some((key) => {
        const formValue = form[key].value === '' ? null : form[key].value;
        return formValue !== initialValue[key];
      });
    } else if (
      this.profileObjectReference !== null &&
      this.profileObjectReference !== undefined &&
      type === 'restriction'
    ) {
      const initialValue = (
        this.profileObjectReference as RegistrantProfileModel
      ).restriction;
      return initialValue !== form.restrictedAccess.value;
    } else if (
      this.profileObjectReference !== null &&
      this.profileObjectReference !== undefined &&
      (type === 'primaryAddress' || type === 'mailingAddress')
    ) {
      const initialValue = (
        this.profileObjectReference as RegistrantProfileModel
      )[type];
      let addressFormValue = null;
      if (type === 'primaryAddress') {
        addressFormValue = form.address.value;
      } else if (type === 'mailingAddress') {
        addressFormValue = form.mailingAddress.value;
      }

      return this.compareAddress(addressFormValue, initialValue);
    } else if (
      this.profileObjectReference !== null &&
      this.profileObjectReference !== undefined &&
      type === 'securityQuestions'
    ) {
      const initialValue = (
        this.profileObjectReference as RegistrantProfileModel
      )[type];
      return this.compareSecurityQuestion(initialValue, form);
    } else if (
      this.fileObjectReference !== null &&
      this.fileObjectReference !== undefined &&
      type === 'evacDetails'
    ) {
      const initialValue = this.fileObjectReference as EvacuationFileModel;
      return this.compareEvacDetails(initialValue, form);
    } else if (
      this.fileObjectReference !== null &&
      this.fileObjectReference !== undefined &&
      type === 'householdMember'
    ) {
      const initialValue = this.fileObjectReference as EvacuationFileModel;
      return this.compareHouseholdMembers(initialValue, form);
    } else if (
      this.fileObjectReference !== null &&
      this.fileObjectReference !== undefined &&
      type === 'animals'
    ) {
      const initialValue = this.fileObjectReference as EvacuationFileModel;
      return this.comparePets(initialValue, form);
    } else if (
      this.fileObjectReference !== null &&
      this.fileObjectReference !== undefined &&
      type === 'needs'
    ) {
      const initialValue = this.fileObjectReference as EvacuationFileModel;
      return this.compareNeeds(initialValue, form);
    }
  }

  hasMemberChanged(members: HouseholdMemberModel[]): boolean {
    const initialValue = (this.fileObjectReference as EvacuationFileModel)
      .householdMembers;
    return _.isEqual(initialValue, members);
  }

  compareAddress(formAddress: AddressModel, incomingAddress: AddressModel) {
    if (
      formAddress.addressLine1 === incomingAddress.addressLine1 &&
      formAddress.addressLine2 === incomingAddress.addressLine2 &&
      ((formAddress.community as Community).code ===
        (incomingAddress.community as Community).code ||
        (formAddress.community as string) === incomingAddress.city) &&
      formAddress.stateProvince.code === incomingAddress.stateProvince.code &&
      formAddress.country.code === incomingAddress.country.code &&
      formAddress.postalCode === incomingAddress.postalCode
    ) {
      return false;
    } else {
      return true;
    }
  }

  compareSecurityQuestion(initialValue: Array<SecurityQuestion>, form) {
    const q1 = form.question1.value;
    const q2 = form.question2.value;
    const q3 = form.question3.value;
    if (initialValue.length > 0) {
      if (
        q1 === initialValue[0].question &&
        q2 === initialValue[1].question &&
        q3 === initialValue[2].question
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  compareEvacDetails(initialValue: EvacuationFileModel, form) {
    if (
      form.facilityName.value === initialValue.registrationLocation &&
      form.insurance.value === initialValue.needsAssessment.insurance &&
      form.householdAffected.value ===
        initialValue.needsAssessment.evacuationImpact &&
      form.emergencySupportServices.value ===
        initialValue.needsAssessment.houseHoldRecoveryPlan &&
      ((form.referredServices.value === 'No' &&
        initialValue.needsAssessment.recommendedReferralServices.length ===
          0) ||
        _.isEqual(
          form.referredServiceDetails.value,
          initialValue.needsAssessment.recommendedReferralServices
        )) &&
      form.externalServices.value ===
        initialValue.needsAssessment.evacuationExternalReferrals &&
      this.compareAddress(form.evacAddress, initialValue.evacuatedFromAddress)
    ) {
      return false;
    } else {
      return true;
    }
  }

  compareHouseholdMembers(initialValue: EvacuationFileModel, form) {
    const specialDietDetails =
      form.specialDietDetails.value === ''
        ? null
        : form.specialDietDetails.value;
    const medSupply =
      globalConst.radioButtonOptions.find(
        (ins) => ins.value === form.medicationSupply.value
      )?.apiValue === null
        ? 'No'
        : globalConst.radioButtonOptions.find(
            (ins) => ins.value === form.medicationSupply.value
          )?.apiValue === null;
    if (
      globalConst.radioButtonOptions.find(
        (ins) => ins.value === form.hasSpecialDiet.value
      )?.apiValue === initialValue.needsAssessment.haveSpecialDiet &&
      specialDietDetails === initialValue.needsAssessment.specialDietDetails &&
      globalConst.radioButtonOptions.find(
        (ins) => ins.value === form.hasMedication.value
      )?.apiValue === initialValue.needsAssessment.takeMedication &&
      medSupply === initialValue.needsAssessment.haveMedicalSupplies
    ) {
      return false;
    } else {
      return true;
    }
  }

  hasPetsChanged(pets: Pet[]): boolean {
    if (
      this.fileObjectReference !== null &&
      this.fileObjectReference !== undefined
    ) {
      const initialValue = (this.fileObjectReference as EvacuationFileModel)
        .needsAssessment.pets;
      return _.isEqual(initialValue, pets);
    }
  }

  comparePets(initialValue: EvacuationFileModel, form) {
    if (
      globalConst.radioButtonOptions.find(
        (ins) => ins.value === form.hasPetsFood.value
      )?.apiValue === initialValue.needsAssessment.havePetsFood &&
      form.petCareDetails.value === initialValue.needsAssessment.petCarePlans
    ) {
      return false;
    } else {
      return true;
    }
  }

  compareNeeds(initialValue: EvacuationFileModel, form) {
    if (
      globalConst.needsOptions.find(
        (ins) => ins.value === form.canEvacueeProvideClothing.value
      )?.apiValue === initialValue.needsAssessment.canProvideClothing &&
      globalConst.needsOptions.find(
        (ins) => ins.value === form.canEvacueeProvideFood.value
      )?.apiValue === initialValue.needsAssessment.canProvideFood &&
      globalConst.needsOptions.find(
        (ins) => ins.value === form.canEvacueeProvideIncidentals.value
      )?.apiValue === initialValue.needsAssessment.canProvideIncidentals &&
      globalConst.needsOptions.find(
        (ins) => ins.value === form.canEvacueeProvideLodging.value
      )?.apiValue === initialValue.needsAssessment.canProvideLodging &&
      globalConst.needsOptions.find(
        (ins) => ins.value === form.canEvacueeProvideTransportation.value
      )?.apiValue === initialValue.needsAssessment.canProvideTransportation
    ) {
      return false;
    } else {
      return true;
    }
  }

  public clearCachedServices() {
    this.cacheService.remove('wizardMenu');
    this.cacheService.remove('wizardType');
    this.appBaseService.wizardProperties = {
      editFlag: false,
      memberFlag: false
    };
    this.computeState.triggerEvent();
  }
}
