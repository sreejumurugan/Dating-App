import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodeToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) {}

changeMemberPhotoUrl(photoUrl: string)
{
  this.photoUrl.next(photoUrl);

}
login(model: any)
{

  return this.http.post(this.baseUrl + 'login', model)
  .pipe(map((response: any) => {
      const user = response;
      if (user)
      {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.decodeToken = this.jwtHelper.decodeToken(user.token);
        this.currentUser = user.user;
        this.changeMemberPhotoUrl(this.currentUser.photoUrl); 
      }
  }));

}

register(model: any)
{
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn()
{
  const token = localStorage.getItem('token');

  //const decodedToken = helper.decodeToken(myRawToken);
 // const expirationDate = helper.getTokenExpirationDate(myRawToken);
  //const isExpired = helper.isTokenExpired(myRawToken);

  return !this.jwtHelper.isTokenExpired(token);


}

}
