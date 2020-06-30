import {Injectable } from "@angular/core";

import {Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthserviceService } from '../_Services/authservice.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]>
{
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

  constructor(private userService: UserService,
     private router: Router,
     private alertify: AlertifyService,
     private authService: AuthserviceService){}

     resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {

        return this.userService.getMessage(this.authService.decodeToken.nameid,
            this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('problem in retreive message');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
     }

}
