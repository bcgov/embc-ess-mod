import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import * as globalConst from '../services/globalConstants';
import { InformationDialogComponent } from '../components/dialog-components/information-dialog/information-dialog.component';
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';

/**
 * A guard function that disables navigation to certain routes.
 *
 * @param disAllowedRoutes - An optional array of routes that should be disallowed.
 *
 * @returns A function that can be used as a route guard, which will display a dialog if the user tries to navigate to a disallowed route.
 */
export function disableGaurdFn(disAllowedRoutes?: Array<string>): CanDeactivateFn<any> {
  return function canDeactivate(
    _component: any,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> {
    const dialog = inject(MatDialog);

    if (disAllowedRoutes && disAllowedRoutes.includes(nextState.url)) {
      return dialog
        .open(DialogComponent, {
          data: {
            component: InformationDialogComponent,
            content: globalConst.invalidGoBack
          },
          width: '400px'
        })
        .afterClosed()
        .pipe(map(() => false));
    }

    return of(true);
  };
}
