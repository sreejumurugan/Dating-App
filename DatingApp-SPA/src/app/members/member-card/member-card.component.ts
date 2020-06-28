import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthserviceService } from 'src/app/_Services/authservice.service';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;
  constructor(private authService: AuthserviceService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }


  sendLike(id: number)
  {
        this.userService.sendLike(this.authService.decodeToken.nameid, id).subscribe(data =>{

           this.alertify.success('You have liked' + this.user.knownAs);
        }, error =>{

             this.alertify.error(error);
        })
  }

}
