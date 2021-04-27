import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../view-user-profile/view-user-profile.module').then(
            (m) => m.ViewUserProfileModule
          )
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('../edit-user-profile/edit-user-profile.module').then(
            (m) => m.EditUserProfileModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule {}
