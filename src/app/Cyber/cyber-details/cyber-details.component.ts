import { Component, OnInit,Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';
import { Output, EventEmitter } from '@angular/core';
import { Cyber } from '../../models/cybers_model';
import { MatCarousel, MatCarouselComponent } from '@ngbmodule/material-carousel';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import { EditCyberInfoComponent } from '../edit-cyber-info/edit-cyber-info.component';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { SignUpOrLoginToRateComponent } from '../../sign-up-or-login-to-rate/sign-up-or-login-to-rate.component';

@Component({
  selector: 'app-cyber-details',
  templateUrl: './cyber-details.component.html',
  styleUrls: ['./cyber-details.component.css']
})
export class CyberDetailsComponent implements OnInit {
  id: number;
  token = this.cookieService.get('etak-start-token') || ''; 
  userObjCyberDetails: any;
  cyberForm = new FormGroup({
    token: new FormControl(''),
    name: new FormControl(''),
    location: new FormControl(''),
    governate: new FormControl(''),
    description: new FormControl(''),
    starting_working_hour: new FormControl(''),
    ending_working_hour: new FormControl(''),
    logo: new FormControl(''),
    cover: new FormControl(''),
    price_per_hour_ps3: new FormControl('0.0'),
    price_per_hour_ps4: new FormControl('0.0'),
    price_per_hour_ps5: new FormControl('0.0'),
    price_per_hour_xbox_360: new FormControl('0.0'),
    price_per_hour_xbox_one: new FormControl('0.0'),
    price_per_hour_xbox_series_x: new FormControl('0.0'),
    price_per_hour_pc: new FormControl('0.0'),
    price_per_hour_vr: new FormControl('0.0'),
  }, [Validators.required]);
  Cyber = [];
  CyberFollowers = [];
  CyberPictures = [];
  CyberEvents = [];
  currentRate = 0;
  allRates = 0;
  averageRating = 0;
  formData = new FormData();
  CyberRatings = [];
  readOnlyValue: boolean;
  config: NgbRatingConfig;
  total = 0;
  isFollowed = false;
  isOpen: boolean;
  days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
  // @Output() newItemEvent = new EventEmitter<number>();
  constructor(private http: HttpClient,config: NgbRatingConfig,private communityService: CommunityService,private route: ActivatedRoute,public dialog: MatDialog,private cookieService: CookieService,private _snackBar: MatSnackBar,public router: Router) {
    config.max = 5;
    // config.readonly = this.readOnlyValue;
    this.config = config
  }
  ngOnInit() {
    
  this.id = parseInt(this.router.url.replace("/place-details/",""));
  setTimeout(()=>{
    this.userObjCyberDetails = this.communityService.getUserObj()
  },500)
  setTimeout(()=>{
    this.getCyberDetails();
  },700)
  
  // this.currentRate = 2; 
  
  }
  
  addCyberFollow(event){
    event.target.innerHTML = '';
    event.target.innerHTML = 'Followed  <i class="fas fa-check" style="font-size: 0.9rem;"></i>';
    this.communityService.addFollower(this.Cyber[0].pk,this.userObjCyberDetails.pk).subscribe(data=>{
      this.isFollowed = true;
    })
  }
  removeCyberFollow(event){
    event.target.innerHTML = '';
    event.target.innerHTML = 'Follow  <i class="fas fa-plus" style="font-size: 0.9rem;"></i>';
    this.communityService.removeFollower(this.Cyber[0].pk,this.userObjCyberDetails.pk).subscribe(data=>{
      this.isFollowed = false;
    })
  }
  async getCyberDetails(){
    
    
    const myFirstPromise = new Promise((resolve, reject) => {  
    resolve(this.communityService.getCyberDetails(this.id).subscribe(data => {
        this.Cyber = data
        
        let workingDays = this.days.slice(this.days.indexOf(this.Cyber[0].fields.starting_working_day),this.days.indexOf(this.Cyber[0].fields.ending_working_day)+1)
        let restDays = this.days.filter(day => !workingDays.includes(day))
        let today = DateTime.now().toLocaleString({ weekday: 'long' })
        if(workingDays.includes(today)){
          this.isOpen = true;
        }else if(restDays.includes(today)){
          this.isOpen = false;
        }
        
        this.communityService.getCyberEvents(data[0].pk).subscribe(data => {
          this.CyberEvents = data
          
        })
        this.communityService.getCyberFollowers(this.Cyber[0].pk).subscribe(data=>{
          this.CyberFollowers = data;
          if(data[0]){
            data.forEach(element => {
              if(this.userObjCyberDetails){
                if(element.fields.user[0] === this.userObjCyberDetails.pk){
                  this.isFollowed = true;
                }
              }else {
                
              }
            });

          }
        })
        this.communityService.getCyberRatings(this.Cyber[0].pk).subscribe(data => {
          this.CyberRatings = data
          this.allRates = data.length
          let oneStar = 0;
          let twoStars = 0;
          let threeStars = 0;
          let fourStars = 0;
          let fiveStars = 0;
          
          for(let i = 0;i<data.length;i++){
            switch (parseInt(data[i].fields.rating)) {
              case 1:
                this.total += parseInt(data[i].fields.rating)*1
                oneStar += 1
                break;
              case 2:
                this.total += parseInt(data[i].fields.rating)*2
                twoStars += 1
                break;
              case 3:
                this.total += parseInt(data[i].fields.rating)*3
                threeStars += 1
                  break;
              case 4:
                this.total += parseInt(data[i].fields.rating)*4
                fourStars += 1
                  break;
              case 5:
                this.total += parseInt(data[i].fields.rating)*5
                fiveStars += 1
                  break;
              default:
                break;
            }
            
            if(!this.userObjCyberDetails){
              this.readOnlyValue = false
            }else {
              if(data[i].fields.user[0] === this.userObjCyberDetails.pk){
                this.readOnlyValue = true
                break
              }else {
                this.readOnlyValue = false
              }
            }
            // if(!this.userObjCyberDetails || (!data[0] && this.userObjCyberDetails.fields.is_cyber_owner === '1')){
            //   this.readOnlyValue = true;
            // }
          }
          let totalAvg = oneStar + twoStars + threeStars + fourStars + fiveStars
          this.averageRating = parseInt(`${(this.total/totalAvg)/5}`);
          // let stars = document.getElementsByClassName("star bad ng-star-inserted")
          // for(let i = 0;i<this.averageRating;i++){
          //     stars[i].classList.add("filled")
          // }
        
    }
    )
      }))
      }
  );
  myFirstPromise.then(() => {
    this.communityService.getCyberPictures(this.id).subscribe(data => {
      this.CyberPictures = data
      


    });
    
})
  }
  
  
  

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  submitRate(event){
    if(this.userObjCyberDetails){
      if(this.readOnlyValue !== true){
        let stars = document.getElementsByClassName("filled")
        for(let i = 0;i<stars.length;i++){
          this.currentRate += 1
        }
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify({
          'user_rating': this.currentRate
        });
          this.http.post('https://etak-start-api.herokuapp.com/add-cyber-rating/'+this.Cyber[0].pk+'/'+this.userObjCyberDetails.pk, body,{'headers':headers})
          .subscribe(res => {
            this.openSnackBar("Rating Added Successfully","Ok");
            this.readOnlyValue = true
            this.allRates += 1
            // setTimeout(()=>{
            //   window.location.reload();
            // },1000)
          },error  => {
            this.openSnackBar("Something went wrong.. Sorry","Ok");
          })
      }else {
      }
      
    }
    else{
      this.openDialogToRate()
    
    }
  }
  addDescription(event){
    let textArea = (document.querySelector("#textArea")) as HTMLTextAreaElement;
    let addBioBtn = document.querySelector("#addDescriptionBtn");
    if(textArea === null){
      let detailsTab = document.querySelector("#descriptionContainer");
      // let newTextArea = document.createElement("textarea");
      // newTextArea.setAttribute("type","text");
      // newTextArea.setAttribute("rows","8");
      // newTextArea.style.color = 'white';
      let txt = '<textarea type="text" id="textArea" rows="12"  style="color:black;width: 100%;"></textarea>';
      detailsTab.innerHTML = txt;
      addBioBtn.textContent = 'Confirm';
    }else {
      this.cyberForm.value['description'] = textArea.value;
      this.cyberForm.value['token']= this.userObjCyberDetails.fields.token;
      const headers = { 'content-type': 'application/json'}; 
    const body=JSON.stringify(this.cyberForm.value);
      this.http.post('https://etak-start-api.herokuapp.com/add-description/'+this.Cyber[0].pk+'/'+this.userObjCyberDetails.pk, body,{'headers':headers})
      .subscribe(res => {
        this.openSnackBar("Description Added Successfully","Ok");
        setTimeout(()=>{
          window.location.reload();
        },1000)
      },error  => {
        this.openSnackBar("Something went wrong.. Sorry","Ok");
      })
  }
  }
  openDialogToRate(): void {
    const dialogRef = this.dialog.open(SignUpOrLoginToRateComponent, {
      width: '450px',
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
