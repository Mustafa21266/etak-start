import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-complete-password-reset',
  templateUrl: './complete-password-reset.component.html',
  styleUrls: ['./complete-password-reset.component.css']
})
export class CompletePasswordResetComponent implements OnInit {
  token = this.cookieService.get('etak-start-token') || '';
  userObjCreateArticle: any;
  formData = new FormData();
  spinner = 0;
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
  confirmResetPasswordForm = new FormGroup({
    password: new FormControl(''),
    confirm_password: new FormControl(''),
  }, [Validators.required]);
  baseUrl = 'https://etak-start-api.herokuapp.com/reset-password';
  userObj = [];
  id: number;
  constructor(private elRef:ElementRef,private communityService: CommunityService,private http: HttpClient,public router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.id = parseInt(this.router.url.replace("/complete-password-reset/",""))
    this.communityService.getUserWithId(this.id).subscribe(data => {
      if(data[0].fields.require_password_reset === '1'){
        this.userObj = data
      }
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSubmit(event) {
    if(this.confirmResetPasswordForm.invalid){
      this.spinner = 0;
      this.openSnackBar("Please fill all required fields","Ok");
    }else{
      if(this.confirmResetPasswordForm.value.password === this.confirmResetPasswordForm.value.confirm_password){
        this.spinner = 1;
        this.communityService.completePasswordReset(this.confirmResetPasswordForm.value,this.userObj[0].pk).subscribe(data => {
        this.openSnackBar('Password Changed Succsessfully',"Ok");
        this.cookieService.set('etak-start-token',data[0].fields.token, 5)
        this.router.navigate(['/homepage'])
      })
      }else {
        this.openSnackBar("Passwords Dont Match!","Ok");
      }
    }
    
  }
}
