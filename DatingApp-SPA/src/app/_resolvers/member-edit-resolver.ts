import {Injectable } from "@angular/core";
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthserviceService } from '../_Services/authservice.service';

@Injectable()
export class MemberEditResolver implements Resolve<User>
{
  constructor(private userService: UserService, private router: Router, private alertify: AlertifyService, private authService: AuthserviceService){}

     resolve(route: ActivatedRouteSnapshot): Observable<User> {

        return this.userService.getUser(this.authService.decodeToken.nameid).pipe(
            catchError(error =>{
                this.alertify.error('problem in retreive your data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
     }

}
