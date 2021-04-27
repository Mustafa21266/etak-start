import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User }from '../models/users_model'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  user : Object;
  formData = new FormData();
  selectedCover : File = null;
  title = "";
  token = this.cookieService.get('etak-start-token') || '';
  spinner = 0;
  constructor(public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,private cookieService: CookieService,private _snackBar: MatSnackBar,private http: HttpClient,public router: Router) { }

  ngOnInit(): void {
    if(this.data[1]){
      this.title = "Change Cyber Cover";
    }else {
      this.title = "Change Profile Cover";
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onCoverSelected(event){
    this.selectedCover = event.target.files[0];
    document.getElementById("coverUploadLabel").textContent = this.selectedCover.name;

  }

  changeCover(event){
    if((<HTMLInputElement>document.getElementById("selectedCover")).value === ''){
      this.spinner = 0;
      this.openSnackBar("Please select a picture to upload","Ok");
    }else {
      const extensions = ['jpg','jpeg','png']
        if(extensions.includes(this.selectedCover.name.split(".")[this.selectedCover.name.split(".").length-1])){
          if(this.router.url.startsWith('/edit-cyber-info')){
            this.spinner = 1;
            this.formData.append('cover', this.selectedCover,this.selectedCover.name);
            this.http.post('http://localhost:8000/change-cyber-cover/'+this.data[1].pk+'/'+this.data[0].pk, this.formData)
              .subscribe(res => {
                this.openSnackBar("Cover Changed Successfully","Ok");
                setTimeout(()=>{
                  window.location.reload();
                },2000)
              },error  => {
                this.spinner = 0;
                this.openSnackBar("Something went wrong.. Sorry","Ok");
              })
          }else if (this.router.url.startsWith('/profiles')){
            this.spinner = 1;
            this.formData.append('cover', this.selectedCover,this.selectedCover.name);
            this.http.post('http://localhost:8000/change-cover/'+this.data.pk, this.formData)
              .subscribe(res => {
                this.openSnackBar("Cover Changed Successfully","Ok");
                setTimeout(()=>{
                  window.location.reload();
                },2000)
              },error  => {
                this.spinner = 0;
                this.openSnackBar("Something went wrong.. Sorry","Ok");
              })
          }else if (this.router.url.startsWith('/edit-cyber-event')) {
      
            this.spinner = 1;
            this.formData.append('cover', this.selectedCover,this.selectedCover.name);
            this.http.post('http://localhost:8000/change-cyber-cover/'+this.data[1].pk+'/'+this.data[0].pk, this.formData)
              .subscribe(res => {
                this.openSnackBar("Cover Changed Successfully","Ok");
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
