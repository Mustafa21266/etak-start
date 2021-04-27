import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ImageUploadComponent} from '../../image-upload/image-upload.component';
import {ChangeProfilePictureComponent} from '../../change-profile-picture/change-profile-picture.component';
import { User }from '../../models/users_model'
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  userObjMyProfile;
  token = this.cookieService.get('etak-start-token') || '';
  userForm = new FormGroup({
    bio: new FormControl(''),
    cover: new FormControl(''),
  }, [Validators.required]);
  selectedProfilePicture: File= null;
  readOnlyValue= true;
  userRatings = [];
  Cybers = []
  Events = []
  userId: number;
  userProfile;
  profilePicture;
  profileCover;
  userLinks = [];
  constructor(private cookieService: CookieService,private router: Router,config: NgbRatingConfig,private communityService: CommunityService,private route: ActivatedRoute,public dialog: MatDialog,private http: HttpClient,private _snackBar: MatSnackBar) {
    config.max = 5;
   }
   
  ngOnInit(): void {
    this.userId = parseInt(this.router.url.replace("/profiles/",""))
    if(!this.token){
      this.getUserInfo([])
      // this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjMyProfile = this.communityService.getUserObj()
        this.getUserInfo(this.userObjMyProfile)
      },500)
      
      // this.route.queryParams.subscribe(params => {
      //   console.group(params)
      //   this.userObjMyProfile = params['userObj'];
      // });

    } 
  }
  getUserInfo(user){
    setTimeout(()=>{
      this.userObjMyProfile = user
      if(this.userObjMyProfile && this.userObjMyProfile.pk === this.userId){
        // this.userId = this.userObjMyProfile.pk
        this.userProfile = this.userObjMyProfile
      }else {
        this.communityService.getUserWithId(this.userId).subscribe(data=>{
          this.userProfile = data[0]
        })
      }
      setTimeout(()=>{
        this.communityService.getUserRatings(this.userProfile.pk).subscribe(data => {
          this.userRatings = data
        })
        if(this.userProfile.fields.is_cyber_owner === '1'){
          this.communityService.GetCyberOwnerCybers(this.userProfile.pk).subscribe(data =>{
            this.Cybers = data;
          })
          this.communityService.GetCyberOwnerEvents(this.userProfile.pk).subscribe(data =>{
            this.Events = data;
          })
        }
        this.communityService.getAllUserLinks(this.userProfile.pk).subscribe(data =>{
          this.userLinks = data;
        })
        if(this.userProfile.fields.profile_picture){
          this.profilePicture = "https://etak-start.s3.eu-west-3.amazonaws.com/media/"+this.userProfile.fields.profile_picture;
        }else{
          this.profilePicture = "https://etak-start.s3.eu-west-3.amazonaws.com/media/default_cover.png";
        }
        if(this.userProfile.fields.cover){
          this.profileCover = "https://etak-start.s3.eu-west-3.amazonaws.com/media/"+this.userProfile.fields.cover;
        }else{
          this.profileCover = "https://etak-start.s3.eu-west-3.amazonaws.com/media/default_cover.png";
        }
      },500)
      
    },500)
  }
  checkUser(){
    setTimeout(()=>{
      this.userObjMyProfile = this.communityService.getUserObj()
      if(this.userObjMyProfile){
        return 0;
      }else {
        return this.checkUser()
      }
    },500)
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onCoverSelected(event){
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '500px',
      height: '450px',
      data: this.userObjMyProfile
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openDialogProfilePicture(): void {
    const dialogRef = this.dialog.open(ChangeProfilePictureComponent, {
      width: '500px',
      height: '450px',
      data: this.userObjMyProfile
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  onProfilePictureSelected(event){
    this.selectedProfilePicture = event.target.files[0];
  }
changeProfilePicture(event){

}
  addBio(event){
    let textArea = (document.querySelector("#textArea")) as HTMLTextAreaElement;
    let addBioBtn = document.querySelector("#addBioBtn");
    let editBioBtn = document.querySelector("#editBioBtn");
    
    if(textArea === null){
      let detailsTab = document.querySelector("#detailsContainer");
      let txt = '<textarea type="text" id="textArea" rows="12"  style="color:black;width: 100%;"></textarea>';
      detailsTab.innerHTML = txt;
      try{
        addBioBtn.textContent = 'Confirm';
        editBioBtn.textContent = 'Confirm';
      }catch(error){
        console.log(error)
      }
    
      
    }else {
      
      try{
        addBioBtn.textContent = 'Confirm';
        editBioBtn.textContent = 'Confirm';
      }catch(error){
        console.log(error)
      }
      this.userForm.value['bio'] = textArea.value;
      const headers = { 
        'content-type': 'application/json',
        'Authorization': this.userObjMyProfile.fields.token,
      };
    const body=JSON.stringify(this.userForm.value);
      this.http.post('http://localhost:8000/add-bio/'+this.userObjMyProfile.pk, body,{'headers':headers})
      .subscribe(res => {
        this.openSnackBar("Bio Added Successfully","Ok");
        setTimeout(()=>{
          window.location.reload();
        },1000)
      },error  => {
        this.openSnackBar("Something went wrong.. Sorry","Ok");
      })
  }
  }
}
