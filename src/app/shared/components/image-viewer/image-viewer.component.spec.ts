import { SwiperModule } from 'ngx-swiper-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser/';
import { FormsModule } from '@angular/forms';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ImageViewerComponent } from './image-viewer.component';
import { MenuService } from '../../service/menu.service';
import { ModalComponent } from '../modal/modal.component';
import { ImagePipe } from '../../pipes/image.pipe';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageViewerComponent, ModalComponent, ImagePipe],
      providers: [TranslateService, MenuService],
      imports: [BrowserModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, FontAwesomeModule, PinchZoomModule, SwiperModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
  });

  it('init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    console.log('ImageViewerComponent');
  });
});
