import { CommonModule } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import 'bootstrap';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  bootstrap: [AppComponent]
})

export class AppModule { }
