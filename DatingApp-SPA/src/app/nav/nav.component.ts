import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../_Services/authservice.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Routes, Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  photoUrl: string;

  title = 'Dating App';

  constructor(public authService: AuthserviceService, private alertify: AlertifyService,private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login()
  {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('login successful');
    }, error => {
        this.alertify.error(error);
    }, () =>{

      this.router.navigate(['/members']);
    });
  }

  logedIn()
  {
    const token = this.authService.loggedIn();

    return token;


  }

  logedOut()
  {
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     this.authService.decodeToken = null;
     this.authService.currentUser = null;
     this.alertify.message('loged out');
     this.router.navigate(['/home']);
  }
}
