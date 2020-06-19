import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService } from '../_Services/authservice.service';
import { AlertifyService } from '../_Services/alertify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthserviceService,
    private alertify: AlertifyService,
    private routes: Router
    ){}

  canActivate(): boolean {

    if (this.authService.loggedIn())
    {
      return true;
    }

    this.alertify.error('Acess Denied');
    this.routes.navigate(['/home']);

    return false;
  }
}
