import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../_Services/authservice.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  title = 'Dating App';

  constructor(private authService: AuthserviceService) { }

  ngOnInit() {
  }

  login()
  {
    this.authService.login(this.model).subscribe(next => {
      console.log('login successful'); }, error => {
         console.log(error);
    });
  }

  logedIn()
  {
    const token = localStorage.getItem('token');

    return !!token;


  }

  logedOut()
  {
     localStorage.removeItem('token');
     console.log('loged out');
  }
}
