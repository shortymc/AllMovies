import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {Injectable, OnDestroy} from '@angular/core';

import {AuthService} from './shared/shared.module';
import {Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGard implements CanActivate, OnDestroy {
  subs: Subscription[] = [];
  constructor(private auth: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.subs.forEach(subscription => subscription.unsubscribe());
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('canActivate', state.url);
    try {
      return this.auth.isAuthenticated().then(isAuth => {
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
      return new Promise(() => {});
    }
  }
}
