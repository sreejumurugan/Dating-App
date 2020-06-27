import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_Services/user.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};





  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
   // this.loadUsers();

   this.route.data.subscribe(data => {

    this.users = data['users'].result;

    this.pagination = data['users'].pagination;
});

   this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
   this.userParams.minAge = 18;
   this.userParams.maxAge = 99;
   this.userParams.orderBy = 'lastActive';

  }


  restFilter()
  {

    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';

    this.loadUsers();
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
      getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
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
