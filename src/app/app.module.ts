import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeIt from '@angular/common/locales/it';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGard } from './app.gards';

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
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use(translate.getBrowserLang());
    registerLocaleData(localeFr);
    registerLocaleData(localeEn);
    registerLocaleData(localeDe);
    registerLocaleData(localeIt);
    registerLocaleData(localeEs);
  }
}
