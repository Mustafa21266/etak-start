import { Component, Input, OnInit } from '@angular/core';
import { CommunityService } from '../etakstart.service';
import { DateTime } from 'luxon';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-homepage-main',
  templateUrl: './homepage-main.component.html',
  styleUrls: ['./homepage-main.component.css']
})
export class HomepageMainComponent implements OnInit {
  userObjHomepage: any;
  token = this.cookieService.get('etak-start-token') || '';
  Cybers = [];
  Articles = [];
  shuffledArticles = [];
  Events = [];
  UserCount = [];
  date;
  homepageUrl = 'https://etak-start.s3.eu-west-3.amazonaws.com/media/homepage-cover.png';
  readOnlyValue = true;
  config: NgbRatingConfig;
  constructor(private communityService: CommunityService,private cookieService: CookieService,config: NgbRatingConfig,public router: Router) { 
    config.max = 5;
  }
 
  ngOnInit(): void {
    this.communityService.getAllCybers().subscribe(data =>{
      this.Cybers = data;
      this.Cybers = this.shuffleArray(this.Cybers)
      this.communityService.getAllUserCount().subscribe(count =>{
            this.UserCount = count.user_count;
          })
      this.communityService.getAllEvents().subscribe(data => {
        this.Events = data;
        this.Events = this.shuffleArray(this.Events)
        data.forEach(element => {
          let now = DateTime.now();
        let newDate = DateTime.fromISO(element.fields.date_added);
        this.date = now.toLocaleString()
          var delta = Math.round((now- newDate) / 1000);
          var minute = 60,
                    hour = minute * 60,
                      day = hour * 24,
                  week = day * 7;
          var fuzzy;
          if (delta < 30) {
              fuzzy = 'just now.';
              element.fields.date_added = fuzzy;
            } else if (delta < minute) {
             fuzzy = delta + ' seconds ago.';
             element.fields.date_added = fuzzy;
            } else if (delta < 2 * minute) {
                fuzzy = 'a minute ago.'
                element.fields.date_added = fuzzy;
             } else if (delta < hour) {
                fuzzy = Math.floor(delta / minute) + ' minutes ago.';
                element.fields.date_added = fuzzy;
            } else if (Math.floor(delta / hour) == 1) {
           fuzzy = '1 hour ago.'
           element.fields.date_added = fuzzy;
            } else if (delta < day) {
             fuzzy = Math.floor(delta / hour) + ' hours ago.';
             element.fields.date_added = fuzzy;
            } else if (delta < day * 2) {
             fuzzy = 'yesterday';
             element.fields.date_added = fuzzy;
            }else {
              element.fields.date_added = element.fields.date_added.slice(0 ,10);
            }
        });
        this.communityService.getAllArticles().subscribe(data => {
          this.Articles = data;
          this.shuffledArticles = this.shuffleArray(data)
          data.forEach(element => {
        
          let now = DateTime.now();
          let newDate = DateTime.fromISO(element.fields.date_added);
          this.date = now.toLocaleString()
            var delta = Math.round((now- newDate) / 1000);
            var minute = 60,
                      hour = minute * 60,
                        day = hour * 24,
                    week = day * 7;
            var fuzzy;
            if (delta < 30) {
                fuzzy = 'just now.';
                element.fields.date_added = fuzzy;
              } else if (delta < minute) {
               fuzzy = delta + ' seconds ago.';
               element.fields.date_added = fuzzy;
              } else if (delta < 2 * minute) {
                  fuzzy = 'a minute ago.'
                  element.fields.date_added = fuzzy;
               } else if (delta < hour) {
                  fuzzy = Math.floor(delta / minute) + ' minutes ago.';
                  element.fields.date_added = fuzzy;
              } else if (Math.floor(delta / hour) == 1) {
             fuzzy = '1 hour ago.'
             element.fields.date_added = fuzzy;
              } else if (delta < day) {
               fuzzy = Math.floor(delta / hour) + ' hours ago.';
               element.fields.date_added = fuzzy;
              } else if (delta < day * 2) {
               fuzzy = 'yesterday';
               element.fields.date_added = fuzzy;
              }else {
                element.fields.date_added = element.fields.date_added.slice(0 ,10);
              }
          });
          
        })
      })
    })
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
