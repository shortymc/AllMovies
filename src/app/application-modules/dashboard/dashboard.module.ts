import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MovieService } from './../../service/movie.service';
import { PersonService } from './../../service/person.service';
import { PersonSearchComponent } from './component/person-search/person-search.component';
import { MovieSearchComponent } from './component/movie-search/movie-search.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const childRoutes: Routes = [
  {
    path: '', component: DashboardComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    DashboardComponent,
    MovieSearchComponent,
    PersonSearchComponent],
    providers: [MovieService, PersonService, TranslateService]
})
export class DashboardModule { }
