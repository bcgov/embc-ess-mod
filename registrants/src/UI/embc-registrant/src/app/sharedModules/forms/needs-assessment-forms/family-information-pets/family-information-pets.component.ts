
import { Component, NgModule, OnInit } from "@angular/core";
import FamilyInformationComponent, { FamilyInformationModule } from "../family-information/family-information.component";
import PetsComponent, { PetsModule } from "../pets/pets.component";
import { FormGroup } from "@angular/forms";


@Component({
  selector: 'app-family-information-pets',
  templateUrl: './family-information-pets.component.html',
  styleUrls: ['./family-information-pets.component.scss']
})
export default class FamilyInformationPetsComponent {
 public formGroup = new FormGroup({})
}

@NgModule({
  imports: [
 FamilyInformationModule,
 PetsModule
  ],
  declarations: [FamilyInformationPetsComponent]
})
class FamilyInformationPetsModule {}
