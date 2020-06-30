import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginationResult } from '../_models/pagination';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../_Services/authservice.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
 
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
 

  constructor(private userService: UserService, private alertify: AlertifyService,
     private route: ActivatedRoute, private authService: AuthserviceService) { }


  ngOnInit() {

    this.route.data.subscribe(data => {

      this.messages = data['messages'].result;
  
      this.pagination = data['messages'].pagination;
  });

  
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
   // console.log(event.page);
    // console.log(this.pagination.currentPage);
    this.loadMessages();
  }

  loadMessages()
  {
     this.userService.
      getMessage(this.authService.decodeToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
     .subscribe(
      (res: PaginationResult<Message[]>) => {

      this.messages = res.result;
      this.pagination = res.pagination;
    },
    error => {
      this.alertify.error(error);
    });
  }


  deleteMessage(id: number)
  {
        this.alertify.confirm('Are you sure you want to delete message',() =>{

              this.userService.deleteMessage(id, this.authService.decodeToken.nameid)
              .subscribe(()=>{
                   this.messages.splice(this.messages.findIndex(m=>m.id == id), 1);
                   this.alertify.success('Message deleted sucessfully');

              }, error => {
                    this.alertify.error('Failed to delete the message');
              });

        })

  }

}
