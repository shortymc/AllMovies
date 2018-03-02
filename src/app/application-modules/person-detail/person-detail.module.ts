import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PersonService } from './../../service/person.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetailComponent } from './component/person-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';

const childRoutes: Routes = [
  {
    path: ':id', component: PersonDetailComponent
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
  declarations: [PersonDetailComponent],
  providers: [PersonService, DropboxService,TranslateService]
})
export class PersonDetailModule { }
