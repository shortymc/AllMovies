import { NgModule } from '@angular/core';
import { DiscoverComponent } from './component/discover.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropboxService } from './../../service/dropbox.service';
import { MovieService } from './../../service/movie.service';
import { SharedModule } from './../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule, MatIconModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule } from '@angular/material';

const childRoutes: Routes = [
  {
    path: '', component: DiscoverComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
    TranslateModule.forChild(),
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonToggleModule
  ],
  providers: [
    MovieService,
    DropboxService,
    TranslateService],
  declarations: [DiscoverComponent]
})
export class DiscoverModule { }