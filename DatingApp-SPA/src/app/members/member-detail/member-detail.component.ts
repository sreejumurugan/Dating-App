import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data =>{

        this.user = data['user'];
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
