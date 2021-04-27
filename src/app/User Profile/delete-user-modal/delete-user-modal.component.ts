import { Component, OnInit,Inject,OnDestroy, Input } from '@angular/core';
import { CommunityService } from '../../etakstart.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent implements OnInit {
  token = this.cookieService.get('etak-start-token') || '';
  spinner = 0;
  User = [];
  constructor(private communityService: CommunityService,public dialogRef: MatDialogRef<DeleteUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }
  openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    }
  ngOnInit(): void {
    if(!this.token){
      this.router.navigate(['homepage']);
    } else {
      
    }
  }
  deleteUser(event){
    this.spinner = 1;
    this.communityService.deleteUser(this.data.pk).subscribe(data => {
      this.User = data
      this.cookieService.delete('etak-start-token');
      setTimeout(()=>{
        this.dialogRef.close();
      this.router.navigate(['/'])
      },2000)
    },error =>{
      this.spinner = 0;
      this.openSnackBar("An error has occurred","Ok");
    });
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  OnDestroy(){
  }
}

