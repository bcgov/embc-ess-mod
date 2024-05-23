import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ApiModule } from './core/api/api.module';
import { ErrorHandlingModule } from './shared/error-handling/error-handing.module';

import { DatePipe } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { Compute } from './core/interfaces/compute';
import { ComputeFeaturesService } from './core/services/compute/computeFeatures.service';
import { ComputeWizardService } from './core/services/compute/computeWizard.service';

export const computeInterfaceToken = new InjectionToken<Compute>('Compute');
