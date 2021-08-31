import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Team } from 'src/app/core/api/models';
import { CacheService } from 'src/app/core/services/cache.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { SupplierService } from 'src/app/core/services/suppliers.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierDetailService {
  private essTeams: Team[];
  constructor(
    private supplierService: SupplierService,
    private cacheService: CacheService,
    private router: Router
  ) {}

  /**
   * Rescinds the relationship as mutual Aid between the given supplier and given ESS Team
   *
   * @param supplierId the supplier's ID
   * @param teamId the ESS Team;s ID
   */
  rescindMutualAid(supplierId: string, teamId: string): void {
    this.supplierService
      .rescindMutualAidSupplier(supplierId, teamId)
      .subscribe((result) => {
        this.router.navigate([
          '/responder-access/supplier-management/suppliers-list'
        ]);
      });
  }

  /**
   * Gets a list of all ESS Teams existing in the ERA System and saves it in cache
   *
   * @returns a list of ESS Teams
   */
  public getEssTeamsList(): Team[] {
    return this.essTeams
      ? this.essTeams
      : JSON.parse(this.cacheService.get('essTeams'))
      ? JSON.parse(this.cacheService.get('essTeams'))
      : this.getEssTeams();
  }

  /**
   * Sets a list of ESS Teams
   *
   * @param essTeams a list os ESS Teams
   */
  private setEssTeams(essTeams: Team[]): void {
    this.essTeams = essTeams;
    this.cacheService.set('essTeams', essTeams);
  }

  /**
   * Gets a list of ESS Teams calling the REST API Service
   *
   * @returns a list os ESS Teams
   */
  private getEssTeams(): Team[] {
    let essTeams: Team[] = [];
    this.supplierService.getMutualAidByEssTeam().subscribe((essTeamsResult) => {
      essTeams = essTeamsResult;
      console.log(essTeamsResult);
      this.setEssTeams(essTeamsResult);
    });
    return essTeams;
  }
}
