import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthserviceService } from '../_Services/authservice.service';
import { AlertifyService } from '../_Services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 //@Input() valuesFromHome: any;
 @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthserviceService, private alertify: AlertifyService ) { }

  ngOnInit() {
  }


  register()
  {
    this.authService.register(this.model).subscribe(() => {
     this.alertify.success('register successful'); }, error => {
      this.alertify.error(error);
    });
  }

  cancel()
  {
    this.cancelRegister.emit(false);
    this.alertify.message('cancel');
  }

}
