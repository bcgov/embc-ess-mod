import { Component } from '@angular/core';
import { ReviewComponent } from '../../../../feature-components/review/review.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [ReviewComponent]
})
export class ProfileComponent {
  type = 'profile';
  currentFlow: string;
  parentPageName = 'dashboard';
}
