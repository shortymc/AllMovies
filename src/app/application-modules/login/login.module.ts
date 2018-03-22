import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect/connect.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes, RouterModule } from '@angular/router';

const childRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'connect', pathMatch: 'full' },
      { path: 'connect', component: ConnectComponent },
    ]
  }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forChild(childRoutes),
  ],
  declarations: [
    ConnectComponent
  ],
  providers: []
})
export class LoginModule { }
