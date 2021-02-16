export const environment = {
    production: false,
    version: '1.0.0',
    tokenRefreshPeriodInSeconds: 1 * 60,
    httpRetryNumber: 3,
    httpRetryDelayInSeconds: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
