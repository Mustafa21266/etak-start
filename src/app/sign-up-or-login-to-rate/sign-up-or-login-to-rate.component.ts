import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-or-login-to-rate',
  templateUrl: './sign-up-or-login-to-rate.component.html',
  styleUrls: ['./sign-up-or-login-to-rate.component.css']
})
export class SignUpOrLoginToRateComponent implements OnInit {

  constructor(public router: Router,public dialogRef: MatDialogRef<SignUpOrLoginToRateComponent>) { }

  ngOnInit(): void {
  }
  goToSignUp(event){
    this.router.navigate(['sign-up']);
    this.dialogRef.close();
  }
  goToLogIn(event){
    this.router.navigate(['log-in']);
    this.dialogRef.close();
  }


}
