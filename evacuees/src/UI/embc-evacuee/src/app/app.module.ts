import { BrowserModule } from '@angular/platform-browser';
import { forwardRef, NgModule, Provider } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/services/auth.interceptor';

export const AUTH_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [AuthInterceptor, AUTH_INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {}
