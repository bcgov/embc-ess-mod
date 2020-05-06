import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SupplierService } from '../service/supplier.service';
import { InvoiceComponent } from './invoice/invoice.component';

@Component({
    selector: 'supplier-submission',
    templateUrl: './supplierSubmission.component.html',
    styleUrls: ['./supplierSubmission.component.scss']
})
export class SupplierSubmissionComponent implements OnInit {

    constructor(private router: Router, private builder: FormBuilder, private supplierService: SupplierService, private factoryResolver: ComponentFactoryResolver, private injector: Injector) { }

    @ViewChild('invoiceContainer', { read: ViewContainerRef }) invoiceContainer: ViewContainerRef;
    invoiceComponent: Promise<Type<InvoiceComponent>>;
    //supplierForm: FormGroup;
    invoiceInjector: any;

    ngOnInit() {
       // this.initializeForm();
        let storedSupplierDetails = this.supplierService.getSupplierDetails();
        if (storedSupplierDetails) {
            this.supplierForm.setValue(storedSupplierDetails);
        }
    }

    //initializeForm() {
        supplierForm = this.builder.group({
            supplierLegalName: [''],
            supplierName: [''],
            location: [''],
            gstNumber: [''],
            remitToOtherBusiness: [''],
    
            address: this.builder.group({
                address1: [''],
                address2: [''],
                city: [''],
                province: ['British Columbia'],
                postalCode: [''],
                country: ['Canada'],
            }),
    
            contactPerson: this.builder.group({
                firstName: [''],
                lastName: [''],
                email: [''],
                phone: [''],
                fax: [''],
            }),
    
            supplierSubmissionType: [''],
            invoices: this.builder.array([
            ])
        });
    //}

    get invoices() {
        return this.supplierForm.get('invoices') as FormArray;
    }

    createInvoiceFormArray() {
        return this.builder.group({
            invoiceNumber: [''],
            referrals: this.builder.array([          
            ])
        }) 
    }

    onSubmit() {
        console.log(this.supplierForm.value)
        let supplierDetails = this.supplierForm.value;
        this.supplierService.setSupplierDetails(supplierDetails);
        this.router.navigate(['/review']);
    }

    onValueChange(event: any) {
        if(event.target.value === 'invoice') {
            this.injectInvoiceTemplate();
        }
    }

    injectInvoiceTemplate() {
        // this.invoiceInjector = Injector.create({
        //     providers: [{
        //         provide: 'supplierForm',
        //         useValue: this.supplierForm
        //     }],
        //     parent: this.injector
        // });

        // this.invoiceComponent = import('./invoice/invoice.component').then(({InvoiceComponent}) => InvoiceComponent);
        this.invoices.push(this.createInvoiceFormArray());
    }

    addInvoiceTemplate() {
        this.injectInvoiceTemplate();
    }


}