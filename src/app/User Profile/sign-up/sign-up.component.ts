import { Component, Input, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CommunityService } from '../../etakstart.service';
import { User } from '../../models/users_model';
import { CookieService } from 'ngx-cookie-service';


import {Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUp implements OnInit {

  
  spinner = 0;
  token = this.cookieService.get('etak-start-token') || '';
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
  userForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    // username: new FormControl(''),
    email: new FormControl(''),
    phone_number: new FormControl(''),
    password: new FormControl(''),
    is_cyber_owner: new FormControl(''),
    date_of_birth: new FormControl(''),
  }, [Validators.required]);
  regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$");
  userType: string;
  constructor(private communityService: CommunityService,public router: Router,private cookieService: CookieService,private http: HttpClient,private _snackBar: MatSnackBar) {
   }
   
  
  

  ngOnInit(): void {
    if(this.token){
      this.router.navigate(['homepage']);
    } else {
      
    } 
  }
  getErrorMessage() {
    if (this.userForm.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Not a valid email';
  }
   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  async onSubmit(){
    if(this.userForm.invalid){
      this.spinner = 0;
      this.openSnackBar("Please fill all required fields","Ok");
    }else {
      this.spinner = 1;
    try {
      // let governateSelect = (document.getElementById("governateList"))  as HTMLSelectElement;
      // this.userForm.value['governate'] = governateSelect.options[governateSelect.selectedIndex].text;
      let date = new Date();
      if(date.getFullYear() - new Date(this.userForm.value.date_of_birth).getFullYear() >= 10){
        await this.communityService.addUser(this.userForm.value).subscribe(
          (data) => {
            if(data.message){
              this.openSnackBar(data.message,"Ok");
              this.spinner = 0;
            }else {
              this.communityService.loginUser(this.userForm.value).subscribe((data) =>{
                this.cookieService.set('etak-start-token', data[0].fields.token, 5 )
                this.communityService.setUserObj(data[0])
                this.openSnackBar("User Created Successfully","Ok");
                this.router.navigate(['homepage']).then(()=>{
                  // window.location.reload()
                })
                // this.router.navigate(['/']) 
              })
               
            }
            
          },error => {
            this.spinner = 0;
            console.log(error)
            this.openSnackBar(error.error.message,"Ok");
          })
      }else {
        this.spinner = 0;
        this.openSnackBar("Date of Birth is not valid!","Ok");
      }
      
    }catch(err){
      console.log("error",err);
    }   
    }
       
  }
  checkRegister(event: KeyboardEvent){
    const passwordField = this.userForm.get('password');
  if(passwordField.value === ""){
    this.enableRegister = false;
  } else if(event.key === "Backspace" && passwordField.value.length > 3){
    if(this.regex.test(passwordField.value)){
      this.enableRegister = true;
      document.getElementById("errorMessage").textContent = ""
    }else {
      this.enableRegister = false;
      document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
    }
  }
  else if(passwordField.value.length > 3){
    if(this.regex.test(passwordField.value)){
      this.enableRegister = true;
      document.getElementById("errorMessage").textContent = ""
    }else {
      this.enableRegister = false;
      document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
    }
    
  }
  else {
    this.enableRegister = false;
  }
  }
  checkPhoneNumber(event){
    if(event.target.value.length !== 11){
      document.getElementById("errorMessagePhone").textContent = "Phone Number Must Be 11 Numbers Long"
    }else {
      let phoneNumberCodes = ['010','011','012','015']
      if(phoneNumberCodes.includes(event.target.value.slice(0,3))){
        document.getElementById("errorMessagePhone").textContent = ""
      }else {
        document.getElementById("errorMessagePhone").textContent = "Phone Number Must Start With 010,011,012 or 015!"
      }
    }
  }
}
