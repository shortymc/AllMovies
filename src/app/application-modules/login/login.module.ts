import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RegisterComponent } from './register/register.component';
import { ChangeQuestionComponent } from './change-question/change-question.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConnectComponent } from './connect/connect.component';
import { ForgotComponent } from './forgot/forgot.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthGard } from '../../app.gards';
import { ProfileComponent } from './profile/profile.component';

const childRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'connect', pathMatch: 'full' },
      { path: 'connect', component: ConnectComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot', component: ForgotComponent },
      { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGard] },
      { path: 'changeQuestion', component: ChangeQuestionComponent, canActivate: [AuthGard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGard] },
    ]
  }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    SharedModule.forChild(),
    FontAwesomeModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    RouterModule.forChild(childRoutes),
  ],
  declarations: [
    ConnectComponent,
    RegisterComponent,
    ForgotComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ChangeQuestionComponent
  ],
  providers: []
})
export class LoginModule { }
