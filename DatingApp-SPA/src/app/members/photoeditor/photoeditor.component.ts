import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthserviceService } from 'src/app/_Services/authservice.service';
import { UserService } from 'src/app/_Services/user.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';


@Component({
  selector: 'app-photoeditor',
  templateUrl: './photoeditor.component.html',
  styleUrls: ['./photoeditor.component.css']
})
export class PhotoeditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;
  
  constructor(private authService: AuthserviceService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }


  initializeUploader()
  {
       this.uploader = new FileUploader({
        url: this.baseUrl + 'users/' + this.authService.decodeToken.nameid + '/photos',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024

       });

       this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

       this.uploader.onSuccessItem = (item, response, status, headers) => {

          if (response)
          {

            const res: Photo = JSON.parse(response);

            const photo = {
                id: res.id,
                url: res.url,
                dateAdded: res.dateAdded,
                description: res.description,
                isMain: res.isMain
               };

                  this.photos.push(photo);

                  if(photo.isMain)
                  {

                    this.authService.changeMemberPhotoUrl(photo.url);
                    this.authService.currentUser.photoUrl = photo.url;
                    localStorage.setItem('user', JSON.stringify(this.authService.currentUser))
                  }
          }

       };
  }


  setMainPhoto(photo: Photo)
  {
        this.userService.setMainPhoto(this.authService.decodeToken.nameid, photo.id).subscribe(() => {

           this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
           this.currentMainPhoto.isMain = false;
           photo.isMain = true;
           //this.getMemberPhotoChange.emit(photo.url);
           this.authService.changeMemberPhotoUrl(photo.url);
           this.authService.currentUser.photoUrl = photo.url;
           localStorage.setItem('user', JSON.stringify(this.authService.currentUser))


        }, error => {
          this.alertify.error(error);
        });

  }

  deletePhoto(id: number)
  {


    this.alertify.confirm("Are you want to delete this photo?", ()=> {

      this.userService.deletePhoto(this.authService.decodeToken.nameid, id).subscribe(() => {

       

        this.photos.splice(this.photos.findIndex(i=> i.id === id), 1);

        this.alertify.success("photo deleted Sucessfully");

      }, error => {
        this.alertify.error(error);
      });

    });
  }
}
