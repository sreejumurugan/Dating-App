import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthserviceService } from 'src/app/_Services/authservice.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthserviceService, private alertify: AlertifyService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.loadMessages();
  }

  loadMessages()
  {
    const currentUserid = +this.authService.decodeToken.nameid;
    this.userService.getMessageThread(this.authService.decodeToken.nameid, this.recipientId)
    .pipe(
       tap(messages => {
debugger;
         // tslint:disable-next-line: prefer-for-of
         for (let i = 0; i < messages.length; i++)
         {

           if (messages[i].isRead === false && messages[i].recipientId  === currentUserid)
           {
               this.userService.markasReadMessage(currentUserid , messages[i].id);
           }


         }


       })
    ).subscribe(messages => {

      this.messages = messages;

    }, error => {

          this.alertify.error(error);
    });

  }

  sendMessage()
  {
    this.newMessage.recipientId = this.recipientId;

    this.userService.sendMessage(this.authService.decodeToken.nameid, this.newMessage)
    .subscribe((message: Message) => {
         debugger;
         this.messages.unshift(message);
         this.newMessage.content = '';

    }, error => {this.alertify.error(error); });
  }

}
