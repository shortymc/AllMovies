import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect/connect.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const childRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'connect', pathMatch: 'full' },
      { path: 'connect', component: ConnectComponent },
      { path: 'register', component: RegisterComponent },
    ]
  }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    TranslateModule.forChild(),
    MatFormFieldModule,
    RouterModule.forChild(childRoutes),
  ],
  declarations: [
    ConnectComponent,
    RegisterComponent
  ],
  providers: [TranslateService]
})
export class LoginModule { }
