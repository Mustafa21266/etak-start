import { Injectable } from '@angular/core';
import { User } from './models/users_model';
import { UserLogin } from './models/users_login_model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private APIUrl = 'https://etak-start-api.herokuapp.com/';
  userObj: any;
  token = this.cookieService.get('etak-start-token') || '';
  httpOptions;
  constructor(private http: HttpClient,private cookieService: CookieService) { 
    if(this.token){
      this.getUserDetail(this.token).subscribe(data =>{
        this.userObj = data[0]
      })
    }
    let csrf = this.cookieService.get("csrftoken");
  if (typeof(csrf) === 'undefined') {
    csrf = '';
  }
  this.httpOptions = {
    headers: new HttpHeaders({
      'X-CSRFToken': csrf,
    'content-type': 'application/json',
    'Authorization': this.token,
  }),
  };
    // this.fetchUserObj()
    
  }
  ngOnInit(): void {
    
  }
  getUserDetail(token: string): Observable<User[]>{
    const headers = { 
      'content-type': 'application/json',
      // 'Authorization': 'Token '+token
    }  
    const body=JSON.stringify({
      token: token
    });
    return this.http.post<User[]>(this.APIUrl+'user-details/'+token,body,{'headers':headers});
  }
  getUserDetailResetPassword(form): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(form);
    return this.http.post(this.APIUrl+'reset-password', body,{'headers':headers});
  }
  completePasswordReset(form,id): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(form);
    return this.http.post(this.APIUrl+'complete-reset-password/'+id, body,{'headers':headers});
  }
  getUserWithId(id): Observable<any>{
    return this.http.get(this.APIUrl+'get-user-with-id/'+id);
  }
  addUser(user: User): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(user);
    return this.http.post(this.APIUrl+'create-user', body,this.httpOptions)
  }
  loginUser(userForm): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(userForm);
    return this.http.post(this.APIUrl+'login-user', body,{'headers':headers})
  }
  getAllCybers(): Observable<any>{
    return this.http.get(this.APIUrl+'get-cybers-all')
  }
  getAllCybersHighestRating(): Observable<any>{
    return this.http.get(this.APIUrl+'get-cybers-all-highest-rating')
  }
  getAllCybersNewlyCreated(): Observable<any>{
    return this.http.get(this.APIUrl+'get-cybers-all-newly-created')
  }
  getAllEvents(): Observable<any>{
    return this.http.get(this.APIUrl+'get-events-all')
  }
  getCyberDetails(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-details/'+id)
  }
  getCyberEventDetails(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-event-details/'+id)
  }
  getCyberRatings(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-ratings/'+id)
  }
  getCyberPictures(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-pictures/'+id)
  }

  getCyberEvents(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-events/'+id)
  }

  addCyber(cyberCreationForm,user_id): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    }; 
    const body=JSON.stringify(cyberCreationForm);
    return this.http.post(this.APIUrl+'add-cyber/'+user_id, body,this.httpOptions)
  }
  deleteCyber(id: number,user_id: number): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token
    };
    const body=JSON.stringify({});
    return this.http.post(this.APIUrl+'delete-cyber/'+id+'/'+user_id,{'headers':headers})
  }
  deleteUser(id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token
    };
    const body=JSON.stringify({});
    return this.http.post(this.APIUrl+'delete-user/'+id,{'headers':headers})
  }
  editProfileInfo(userForm,id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    }; 
    const body=JSON.stringify(userForm);
    return this.http.post(this.APIUrl+'edit-profile-info/'+id, body,{'headers':headers})
  }
  editCyberInfo(cyberForm,id,user_id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };  
    const body=JSON.stringify(cyberForm);
    return this.http.post(this.APIUrl+'edit-cyber-info/'+id+'/'+user_id, body,{'headers':headers})
  }
  addCyberEvent(cyberEventForm,id,user_id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body=JSON.stringify(cyberEventForm);
    return this.http.post(this.APIUrl+'add-cyber-event/'+id+'/'+user_id, body,{'headers':headers})
  }
  editCyberEvent(cyberEventForm,id,pk,user_id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body=JSON.stringify(cyberEventForm);
    return this.http.post(this.APIUrl+'edit-cyber-event/'+id+'/'+pk+'/'+user_id, body,{'headers':headers})
  }
  deleteCyberEvent(id,pk,user_id: string): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body=JSON.stringify({});
    return this.http.post(this.APIUrl+'delete-cyber-event/'+id+'/'+pk+'/'+user_id, body,{'headers':headers})
  }
  getSearchResults(): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    // const body=JSON.stringify(cyberEventForm);
    return this.http.get(this.APIUrl+'search',{'headers':headers})
  }
  createArticle(articleForm,id): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(articleForm);
    return this.http.post(this.APIUrl+'create-article/'+id,articleForm)
  }
  editArticle(articleForm,id,user_id): Observable<any>{
    const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(articleForm);
    return this.http.post(this.APIUrl+'edit-article/'+id+'/'+user_id,articleForm)
  }
  getArticle(id): Observable<any>{
    return this.http.get(this.APIUrl+'get-article/'+id)
  }
  getAllArticles(): Observable<any>{
    return this.http.get(this.APIUrl+'get-all-articles')
  }
  getKYCCArticles(): Observable<any>{
    return this.http.get(this.APIUrl+'get-know-your-content-creator-articles')
  }
  deleteArticle(id,user_id): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body=JSON.stringify({});
    return this.http.post(this.APIUrl+'delete-article/'+id+'/'+user_id,body,{'headers':headers})
  }
  getUserRatings(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-user-ratings/'+id)
  }
  getAllRatings(): Observable<any>{
    return this.http.get(this.APIUrl+'get-all-ratings')
  }
  GetCyberOwnerCybers(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-owner-cybers/'+id)
  }
  GetCyberOwnerEvents(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-owner-events/'+id)
  }
  getAllUserCount(): Observable<any>{
    return this.http.get(this.APIUrl+'get-all-users-count')
  }
  GetUserNotifications(id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-user-notifications/'+id)
  }
  markAsRead(notification_id: number,user_id: number): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body='';
    return this.http.post(this.APIUrl+'mark-as-read/'+notification_id+'/'+user_id,body,{'headers':headers})
  }
  addFollower(cyber_id: number,user_id: number): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body='';
    return this.http.post(this.APIUrl+'add-cyber-follower/'+cyber_id+'/'+user_id,body,{'headers':headers})
  }
  removeFollower(cyber_id: number,user_id: number): Observable<any>{
    const headers = { 
      'content-type': 'application/json',
      'Authorization': this.token,
    };
    const body='';
    return this.http.post(this.APIUrl+'remove-cyber-follower/'+cyber_id+'/'+user_id,body,{'headers':headers})
  }
  getCyberFollowers(cyber_id: number): Observable<any>{
    return this.http.get(this.APIUrl+'get-cyber-followers/'+cyber_id)
  }
  /*
  USER GETTER AND SETTER
  */
 getUserObj(){
    return this.userObj
}
setUserObj(userObj: any): Observable<any>{
  this.userObj = userObj
  return this.userObj
}
fetchUserObj(): Observable<any>{
  if(this.token !== ''){
    
  }else {
    return this.fetchUserObj()
  }
}
/*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
changeShowHideEmailSetting(setting,user_id: number): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify({
    'show_or_hide_email': setting
  });
  return this.http.post(this.APIUrl+'change-show-hide-email-setting/'+user_id,body,{'headers':headers})
}
changeShowHidePhoneNumberSetting(setting,user_id: number): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify({
    'show_or_hide_phone_number': setting
  });
  return this.http.post(this.APIUrl+'change-show-hide-phone-number-setting/'+user_id,body,{'headers':headers})
}
changeShowHideDateOfBirthSetting(setting,user_id: number): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify({
    'show_or_hide_date_of_birth': setting
  });
  return this.http.post(this.APIUrl+'change-show-hide-date-of-birth-setting/'+user_id,body,{'headers':headers})
}
changeCreatorMode(setting,user_id: number): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify({
    'is_content_creator': setting
  });
  return this.http.post(this.APIUrl+'change-creator-mode/'+user_id,body,{'headers':headers})
}
async deleteToken(){
  this.token = "";
  await this.cookieService.delete("etak-start-token", '/');
  return this.token;
}

createUserLink(linkForm,id): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify(linkForm);
  return this.http.post(this.APIUrl+'create-content-creator-link/'+id,body,{'headers':headers})
}
editUserLink(linkForm,id,user_id): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify(linkForm);
  return this.http.post(this.APIUrl+'update-content-creator-link/'+id+'/'+user_id,body,{'headers':headers})
}
getAllUserLinks(user_id: number): Observable<any>{
  return this.http.get(this.APIUrl+'get-content-creator-links/'+user_id)
}
deleteUserLink(id,user_id): Observable<any>{
  const headers = { 
    'content-type': 'application/json',
    'Authorization': this.token,
  };
  const body=JSON.stringify({});
  return this.http.post(this.APIUrl+'delete-content-creator-link/'+id+'/'+user_id,body,{'headers':headers})
}

}
