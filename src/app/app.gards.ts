import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthGard implements CanActivate, OnDestroy {
  subs = [];
  constructor(private auth: AuthService, private router: Router) { }

  ngOnDestroy() {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    localStorage.setItem('token',
      `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoicG1iIiwiaWQiOiIxIiwicGFzc3dvcmQiOiJkZTFmNWY5MzU0ZTU1ODQ4MTNhZWYyM2E1ZTQ3ZTVhMz
      lhN2M5ZjcxYzcyZGVmNGQ2NzE4MjMzMzQyMWIwMDY0ZjU0MWU1NjE0MmRjOGQzZWI0MzZmYmUxNWJiZmI3NDg4ZjZiYzdjNmIwYWNlOTA3NDJkNTgzZThkOWYxM2Q2Zi
      IsImlhdCI6MTUxMjU2ODA3OCwianRpIjoiNWY5ZDI1NTYtNDRiZi00N2IxLTgxYTAtODAxZTdhMmQyNDliIiwiZXhwIjoxNTE4NzAzMTE5fQ.slKKc7g-wQSUJ6detTd
      fjOb3Ju1BYlGXRhaWGAzewHs`);
    console.log('canActivate', state.url);
    try {
      return this.auth.isAuthenticated().then((isAuth) => {
        console.log('isAuth', isAuth);
        if (!isAuth) {
          console.log('not isAuthenticated');
          this.router.navigate(['/login']);
          return false;
        }
        console.log('logged');
        // this.router.navigate([state.url]);
        return true;
      });
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => { });
    }
  }
}
