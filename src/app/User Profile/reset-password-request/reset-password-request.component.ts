import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {state} from '../../etakstart.service';
@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent implements OnInit {
  // @Input() userObjCreateArticle: any;
  token = this.cookieService.get('etak-start-token') || '';
  userObjCreateArticle: any;
  spinner = 0;
  formData = new FormData();
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
  resetPasswordForm = new FormGroup({
    email: new FormControl(''),
  }, [Validators.required]);
  baseUrl = 'https://etak-start-api.herokuapp.com/reset-password';
  constructor(private elRef:ElementRef,private route: ActivatedRoute,private communityService: CommunityService,private http: HttpClient,public router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userObjCreateArticle = JSON.parse(this.route.snapshot.paramMap.get('userObj'))
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSubmit(event) {
    if(this.resetPasswordForm.invalid){
      this.spinner = 0;
      this.openSnackBar("Please fill all required fields","Ok");
    }else {
      this.communityService.getUserDetailResetPassword(this.resetPasswordForm.value).subscribe(data => {
        this.spinner = 1;
        this.openSnackBar(data.message,"Ok");
        this.spinner = 0;
      })
    }
    
  }
}
