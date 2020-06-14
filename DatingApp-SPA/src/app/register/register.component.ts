import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthserviceService } from '../_Services/authservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 //@Input() valuesFromHome: any;
 @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthserviceService) { }

  ngOnInit() {
  }


  register()
  {
    this.authService.register(this.model).subscribe(() => {
      console.log('register successful'); }, error => {
         console.log(error);
    });
  }

  cancel()
  {
    this.cancelRegister.emit(false);
    console.log('cancel');
  }

}
