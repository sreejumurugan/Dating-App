import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/User';
import { NgForm } from '@angular/forms';
import { AuthserviceService } from 'src/app/_Services/authservice.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user: User;
  photoUrl: string;
  @ViewChild('editForm',  {static: true}) editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  
  unloadNotification($event: any)
  {
    if(this.editForm.dirty)
    {
          $event.returnValue=true;
    }
  }
  
  constructor(private route: ActivatedRoute, private alertify: AlertifyService,private userService: UserService,
     private authService: AuthserviceService) { }


  ngOnInit() {

    this.route.data.subscribe(data =>{

      this.user = data['user'];
  });

  this.authService.currentPhotoUrl.subscribe(photoUrl=> this.photoUrl = photoUrl)
  }

  updateUser()
  {

    this.userService.updateUser(this.authService.decodeToken.nameid, this.user).subscribe(next =>{
      this.alertify.success('Profile updated sucessfuly');
      this.editForm.reset(this.user);
    }, error=> {

        this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl)
  {

    this.user.photoUrl = photoUrl;
  }

}
