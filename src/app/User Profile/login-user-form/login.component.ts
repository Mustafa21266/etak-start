import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CommunityService } from '../../etakstart.service';
import { UserLogin } from '../../models/users_login_model';
import { CookieService } from 'ngx-cookie-service';
import {ActivatedRoute, Router} from "@angular/router";

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Login implements OnInit {
  userObj: any;
  @Output() userObjChange = new EventEmitter<any>();
  spinner = 0;
  hide = true;
  enableLogin = false;
  token = this.cookieService.get('etak-start-token') || '';
  userLoginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  }, [Validators.required]);
  regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$");
  constructor(private communityService: CommunityService,private route: ActivatedRoute,private cookieService: CookieService,public router: Router,private _snackBar: MatSnackBar) { 
    
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
    if(this.token){
      this.router.navigate(['homepage']);
    } else {
      this.userObj = JSON.parse(this.route.snapshot.paramMap.get('userObj'))
    }   
  }
  refresh(){
  }
  refreshPage() {
    this.router.navigate(['/homepage'])
   }
  getErrorMessage() {
    if (this.userLoginForm.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Not a valid email or password';
  }
  logUserFunction(user){
    this.userObjChange.emit(user)
  }
  async onSubmit(){
    if(this.userLoginForm.invalid){
      this.openSnackBar("Invalid email or password!","Ok");
    }else {
      this.spinner = 1;
      try {
        await this.communityService.loginUser(this.userLoginForm.value).subscribe((data) => {
          if(data.message){
            this.openSnackBar(data.message,"Ok");
            this.spinner = 0;
          }else {
            this.cookieService.set('etak-start-token', data[0].fields.token, 5);
            let x = this.communityService.setUserObj(data[0])
              this.openSnackBar("Logged-in Successfully","Ok");
              this.router.navigate(['homepage']).then(()=>{
                // window.location.reload()
              })
              // this.refreshPage();
             
              // this.logUserFunction(data[0]);
              
              
            } 
        },error => {
          this.spinner = 0;
          this.openSnackBar(error.error.message,"Ok");
        });
      }catch(err){
        console.log("error",err);
      } 
    }
            
  }
  checkLogin(event: KeyboardEvent){
    const passwordField = this.userLoginForm.get('password');
    if(passwordField.value === ""){
      this.enableLogin = false;
    } else if(event.key === "Backspace" && passwordField.value.length > 3){
      if(this.regex.test(passwordField.value)){
        this.enableLogin = true;
        document.getElementById("errorMessage").textContent = ""
      }else {
        this.enableLogin = false;
        document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
      }
    }
    else if(passwordField.value.length > 3){
      if(this.regex.test(passwordField.value)){
        this.enableLogin = true;
        document.getElementById("errorMessage").textContent = ""
      }else {
        this.enableLogin = false;
        document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
      }
      
    }
    else {
      this.enableLogin = false;
    }
  };

  
}
