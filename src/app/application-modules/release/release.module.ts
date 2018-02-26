import { MovieService } from './../../service/movie.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyNgbDate } from './../../shared/my-ngb-date';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReleaseComponent } from './component/release.component';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';

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
    NgbModule
  ],
  providers: [
    MyNgbDate,
    MovieService,
    DatePipe,
    DropboxService
  ],
  declarations: [ReleaseComponent],
})
export class ReleaseModule { }
