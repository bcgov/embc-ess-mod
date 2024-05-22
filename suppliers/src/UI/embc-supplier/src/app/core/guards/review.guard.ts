import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SupplierService } from '../services/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewGuard {
  constructor(
    private router: Router,
    private supplierService: SupplierService
  ) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.supplierService.getSupplierDetails()) {
      this.router.navigate(['/submission']);
      return false;
    } else {
      return true;
    }
  }
}
