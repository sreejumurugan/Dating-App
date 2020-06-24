import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from './_Services/authservice.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Dating App';
  jwtHelper = new JwtHelperService();

  constructor(public authService: AuthserviceService) { }

  ngOnInit() {

    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

if (token){
  this.authService.decodeToken = this.jwtHelper.decodeToken(token);
}

if (user){
  this.authService.currentUser = user;
  this.authService.changeMemberPhotoUrl(user.photoUrl);
}
  
  }
}
