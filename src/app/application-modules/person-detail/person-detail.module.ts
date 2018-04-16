import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PersonService } from './../../service/person.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetailComponent } from './component/person-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DropboxService } from '../../service/dropbox.service';
import { TitleService } from '../../service/title.service';

const childRoutes: Routes = [
  {
    path: ':id', component: PersonDetailComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  declarations: [PersonDetailComponent],
  providers: [PersonService, DropboxService, TranslateService, TitleService]
})
export class PersonDetailModule {}
