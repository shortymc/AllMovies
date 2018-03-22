import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthGard implements CanActivate, OnDestroy {
  subs = [];
  constructor(private auth: AuthService, private router: Router) { }

  ngOnDestroy() {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoicG1iIiwiaWQiOiIxIiwicGFzc3dvcmQiOiIzYmFiNmUxZTAxOThjOGY0MTgzY2EzOWRlYTY4ZmUzZjUyOGMxNTNkOTRkMTIyMWQyYTUwYzUzYjBmOGZhYTk3NjIxODcyMzk5MjJjMTA1M2YyMWFlNDgyOTkxNGFhNzI4M2E4NDQ2Mjk5YmE1MjQ4YTVmM2JiNGJhNGFlZTZiYyIsImlhdCI6MTUxMjU2ODA3OCwianRpIjoiNWY5ZDI1NTYtNDRiZi00N2IxLTgxYTAtODAxZTdhMmQyNDliIiwiZXhwIjoxNTE4NzAzMTE5fQ.cGD9XCjWWghWd_UehIL2EZRo9mEYpfdxAuN82H4EmMQ');
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
    };
  }
}
