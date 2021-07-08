import { Component, OnInit,Inject,OnDestroy, Input } from '@angular/core';
import { CommunityService } from '../../etakstart.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {state} from '../../etakstart.service';
import { CyberDetailsComponent } from '../cyber-details/cyber-details.component';


@Component({
  selector: 'app-delete-cyber',
  templateUrl: './delete-cyber.component.html',
  styleUrls: ['./delete-cyber.component.css']
})
export class DeleteCyberComponent implements OnInit {
  token = this.cookieService.get('etak-start-token') || '';
  Cyber = [];
  spinner = 0;
  constructor(private communityService: CommunityService,public dialogRef: MatDialogRef<DeleteCyberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>,private router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {

    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  deleteCyber(event){
    this.spinner = 1;
    this.communityService.deleteCyber(this.data[0].pk,this.data[1].pk).subscribe(data => {
      this.Cyber = data
      let newState = Object.assign({},state,{
        Cybers: state.Cybers.filter(cyber => cyber.pk !== this.data[0].pk)
        })
      this.communityService.changeState(newState);
      this.openSnackBar("Cyber Deleted Successully","Ok");
      this.dialogRef.close();
      this.router.navigate(['/places-all'])
    },error =>{
      this.openSnackBar("An error has occurred","Ok");
    });

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  OnDestroy(){
    // window.location.reload();
  }
}
