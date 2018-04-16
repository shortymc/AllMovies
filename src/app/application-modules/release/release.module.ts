import { OmdbService } from './../../service/omdb.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MovieService } from './../../service/movie.service';
import { MyNgbDate } from './../../shared/my-ngb-date';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReleaseComponent } from './component/release.component';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';
import { TitleService } from '../../service/title.service';

const childRoutes: Routes = [
  {
    path: '', component: ReleaseComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
    RatingModule,
    TranslateModule.forChild(),
  ],
  providers: [
    MyNgbDate,
    MovieService,
    DatePipe,
    DropboxService,
    OmdbService,
    TranslateService,
    TitleService
  ],
  declarations: [ReleaseComponent],
})
export class ReleaseModule { }
