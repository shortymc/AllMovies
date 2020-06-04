import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClientJsonpModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGard } from './app.gards';
import { GlobalErrorHandler } from './shared/service/global-error-handler';
import { ServerErrorInterceptor } from './shared/service/server-error.interceptor';
import { MyMissingTranslationHandler } from './shared/my-missing-translation-handler';

@NgModule({
  imports: [
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    SharedModule.forRoot(),
    MatSnackBarModule,
    TranslateModule.forRoot({
      useDefaultLang: false,
      defaultLanguage: 'en',
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader => {
          return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    AuthGard,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
    registerLocaleData(localeEn);
  }
}
