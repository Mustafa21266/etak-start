import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../etakstart.service';
import { User }from '../models/users_model'
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.css']
})
export class ChangeProfilePictureComponent implements OnInit {
  user : Object;
  formData = new FormData();
  title = "";
  id: number;
  token = this.cookieService.get('etak-start-token') || '';
  private sub: any;
  selectedProfilePicture : File = null;
  spinner = 0;
  constructor(private cookieService: CookieService,public dialogRef: MatDialogRef<ChangeProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,private _snackBar: MatSnackBar,private http: HttpClient,private route: ActivatedRoute,private communityService: CommunityService,public router: Router) { }

  ngOnInit(): void {
    this.id = parseInt(this.router.url.replace("/change-profile-picture/",""));
  //   this.sub = this.route.params.subscribe(params => {
      
  //     if(this.id && this.token){
  //       this.communityService.getUserDetail(this.token).subscribe(data => {
  //         this.data[0] = data[0]
  //       })
  //       this.communityService.getCyberDetails(this.id).subscribe(data => {
  //         this.data[1] = data[0]
  //       })
  //     }
  //  });
    if(this.data[1]){
      this.title = "Change Cyber Logo";
    }else {
      this.title = "Change Profile Picture";
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onCoverSelected(event){
    this.selectedProfilePicture = event.target.files[0];
    document.getElementById("profilePictureUploadLabel").textContent = this.selectedProfilePicture.name;

  }

  async changeCover(event){
    if((<HTMLInputElement>document.getElementById("selectedProfilePicture")).value === ''){
      this.spinner = 0;
      this.openSnackBar("Please select a picture to upload","Ok");
    }else{
      const extensions = ['jpg','jpeg','png']
      if(extensions.includes(this.selectedProfilePicture.name.split(".")[this.selectedProfilePicture.name.split(".").length-1])){
        if(this.router.url.startsWith('/edit-cyber-info')){
          this.spinner = 1;
          this.formData.append('logo', this.selectedProfilePicture,this.selectedProfilePicture.name);
          this.formData.append('token', this.data[0].fields.token);
          this.http.post('http://localhost:8000/change-cyber-profile-pic/'+this.data[1].pk+'/'+this.data[0].pk, this.formData)
            .subscribe(res => {
              this.openSnackBar("Cyber Logo Changed Successfully","Ok");
              setTimeout(()=>{
                window.location.reload();
              },2000)
            },error  => {
              this.spinner = 0;
              this.openSnackBar("Something went wrong.. Sorry","Ok");
            })
          
        }else if (this.router.url.startsWith('/profiles')) {
          this.spinner = 1;
          this.formData.append('profile_picture', this.selectedProfilePicture,this.selectedProfilePicture.name)
          this.formData.append('token', this.data.fields.token);
          this.http.post('http://localhost:8000/change-profile-pic/'+this.data.pk, this.formData)
            .subscribe(res => {
              this.openSnackBar("Profile Picture Changed Successfully","Ok");
              setTimeout(()=>{
                window.location.reload();
              },2000)
            },error  => {
              this.spinner = 0;
              this.openSnackBar("Something went wrong.. Sorry","Ok");
            })
      }
      }else {
        this.spinner = 0;
        this.openSnackBar("Please select a valid extension!","Ok");
      }
      
    }
    
    }
      

}
