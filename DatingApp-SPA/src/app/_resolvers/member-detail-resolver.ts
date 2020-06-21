import {Injectable } from "@angular/core";
import {User} from '../_models/user';
import {Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailsResolver implements Resolve<User>
{
  constructor(private userService: UserService, private router: Router, private alertify: AlertifyService){}

     resolve(route: ActivatedRouteSnapshot): Observable<User> {

        return this.userService.getUser(route.params['id']).pipe(
            catchError(error =>{
                this.alertify.error('problem in retreive data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
     }

}
