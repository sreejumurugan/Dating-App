import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthserviceService } from '../_Services/authservice.service';
import { AlertifyService } from '../_Services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/User';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 //@Input() valuesFromHome: any;

 @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>; //all of we made optional //
 
  constructor(private authService: AuthserviceService, private router: Router, private alertify: AlertifyService, private fb: FormBuilder ) { }

  ngOnInit() {
    this.bsConfig = {

       containerClass: 'theme-red'
    },
    this.createRegisterForm();
  }

   createRegisterForm()
   {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required ],
      knownAs: ['', Validators.required ],
      dateOfBirth: [null, Validators.required ],
      city: ['', Validators.required ],
      country: ['', Validators.required ],
      password: ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(8)] ],
      confirmPassword: ['', Validators.required ]

     }, {validator: this.passwordMatchValidator});

   }



   passwordMatchValidator(g: FormGroup)
   {

    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};

   }

  register()
  {

    if (this.registerForm.valid)
    {
      this.user = Object.assign({}, this.registerForm.value);

       this.authService.register(this.user).subscribe(() => {
     this.alertify.success('register successful'); }, error => {
       this.alertify.error(error);
    }, () => {

      this.authService.login(this.user).subscribe(() => {

        this.router.navigate(['/members']);
      });
    });
    }
   

    console.log(this.registerForm.value);
  }

  cancel()
  {
    this.cancelRegister.emit(false);
    this.alertify.message('cancel');
  }

}
