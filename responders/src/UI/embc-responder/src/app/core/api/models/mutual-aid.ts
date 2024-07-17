/* tslint:disable */
/* eslint-disable */
import { SupplierTeam } from '../models/supplier-team';
export interface MutualAid {
  givenByTeamId?: string | null;
  givenOn?: string;
  givenToTeam?: SupplierTeam;
}
