import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_Services/user.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from '../_models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  // user: User = JSON.parse(localStorage.getItem('user'));
  // genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  likesParam: string;

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute,
    ) { }


  ngOnInit() {


    this.route.data.subscribe(data => {

      this.users = data['users'].result;

      this.pagination = data['users'].pagination;

  });

    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
   // console.log(event.page);
    // console.log(this.pagination.currentPage);
    this.loadUsers();
  }
  loadUsers()
  {
     this.userService.
      getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
     .subscribe(
      (res: PaginationResult<User[]>) => {

      this.users = res.result;
      this.pagination = res.pagination;
    },
    error => {
      this.alertify.error(error);
    });
  }

}
