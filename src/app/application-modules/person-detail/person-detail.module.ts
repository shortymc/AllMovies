import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetailComponent } from './component/person-detail.component';
import { RatingModule } from 'ngx-rating';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: ':id', component: PersonDetailComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(childRoutes),
    SharedModule,
  ],
  declarations: [PersonDetailComponent]
})
export class PersonDetailModule { }
