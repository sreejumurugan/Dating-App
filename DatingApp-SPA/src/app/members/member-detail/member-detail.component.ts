import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthserviceService } from 'src/app/_Services/authservice.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {


  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute,
              private authService: AuthserviceService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {



    this.route.data.subscribe(data => {

        this.user = data['user'];
    });

    this.route.queryParams.subscribe(params => {

      const selectedTab = params['tab'] > 0 ? params['tab'] : 0;

      this.memberTabs.tabs[selectedTab].active = true;
     });


    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          thumbnailsColumns: 4,
          imagePercent: 100,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 400,
          preview: false
      }
  ];

    this.galleryImages = this.getImages();
  }



  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(id: number)
  {
        this.userService.sendLike(this.authService.decodeToken.nameid, id).subscribe(data => {

           this.alertify.success('You have liked' + this.user.knownAs);
        }, error => {

             this.alertify.error(error);
        });
  }

  getImages()
  {
    const imageUrls = [];

    for (const photo of this.user.photos){

      imageUrls.push({

        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description

      });

    }
    return imageUrls;
  }


  // loadUser()
  // {
   // this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) =>{

    //  this.user = user;
   // },
   // error => {
    //  this.alertify.error(error);
  //  })
 // }

}
