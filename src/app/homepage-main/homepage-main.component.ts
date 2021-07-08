import { Component, Input, OnInit } from '@angular/core';
import { CommunityService } from '../etakstart.service';
import { DateTime } from 'luxon';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
// import { fadeInAnimation } from '../app.component';
import {state} from '../etakstart.service';
@Component({
  selector: 'app-homepage-main',
  templateUrl: './homepage-main.component.html',
  // animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./homepage-main.component.css']
})
export class HomepageMainComponent implements OnInit {
  userObjHomepage: any;
  token = this.cookieService.get('etak-start-token') || '';
  Cybers = [];
  Articles = [];
  KYCCArticles = [];
  shuffledArticles = [];
  Events = [];
  UserCount = 0;
  date;
  homepageUrl = 'https://etak-start.s3.eu-west-3.amazonaws.com/media/homepage-cover.png';
  readOnlyValue = true;
  config: NgbRatingConfig;
  spinner = 0;
  constructor(private communityService: CommunityService,private cookieService: CookieService,config: NgbRatingConfig,public router: Router) { 
    config.max = 5;
  }
  ngOnInit(): void {
    this.spinner = 1;
    this.communityService.getAllUserCount().subscribe(count =>{
      this.UserCount = count.user_count;
    },error =>{
      this.spinner = 0;
      console.log(error)
    })

    setTimeout(()=>{
      this.Cybers = state.Cybers
      console.log(this.Cybers)
      this.Events = state.Events
      this.Articles = state.Articles
      this.KYCCArticles = state.KYCCArticles
      this.spinner = 0;
      this.shuffledArticles = this.shuffleArray(this.Articles).concat(this.shuffleArray(this.KYCCArticles))
    },1000)
 
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
openWhatIsEtakStart(event){
  this.router.navigate(['articles','1'])
}
cardMouseEnter(event){
  event.target.style.filter = 'opacity(60%)';
  
}
cardMouseLeave(event){
  event.target.style.filter = 'opacity(100%)';
}
}
