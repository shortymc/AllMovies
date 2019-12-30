import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { OpenLinkDirective } from '../../directives/open-link.directive';
import { CapitalizeWordPipe } from '../../pipes/capitalizeWord.pipe';
import { ListDatasComponent } from './list-datas.component';
import { AddCollectionDirective } from '../../directives/add-collection.directive';
import { ImagePipe } from '../../pipes/image.pipe';

describe('ListMoviesComponent', () => {
  let component: ListDatasComponent;
  let fixture: ComponentFixture<ListDatasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListDatasComponent, OpenLinkDirective, CapitalizeWordPipe, AddCollectionDirective, ImagePipe],
      providers: [TranslateService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule, MatButtonToggleModule,
        MatSelectModule, MatFormFieldModule, NgbModule, MatTooltipModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDatasComponent);
    component = fixture.componentInstance;
    component.label = 'TEST';
    component.movies = [];
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ListMoviesComponent');
  });
});
