import { AuthService } from './../../../service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  name: string;
  password: string;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    console.log('name', this.name);
    console.log('password', this.password);
    // this.auth.isAllowed().then((resp) => console.log(resp));
  }

}
