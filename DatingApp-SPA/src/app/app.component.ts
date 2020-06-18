import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from './_Services/authservice.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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

if (token){
  this.authService.decodeToken = this.jwtHelper.decodeToken(token);
}
  
  }
}
