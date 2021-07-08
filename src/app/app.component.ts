import { Component, EventEmitter, Input, OnInit, Output, HostBinding } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from './etakstart.service';
import { User } from './models/users_model';
import {Router, RouterOutlet} from "@angular/router";
import {SwPush} from '@angular/service-worker';

// import { slideInAnimation } from './animations';
// import {
//   trigger,
//     state,
//     style,
//     animate,
//     transition,
//     query,
//     animateChild,
//     group,
//   // ...
// } from '@angular/animations';
import { SimpleChange } from '@angular/core';
import { from } from 'rxjs';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
// export const fadeInAnimation =
//     // trigger name for attaching this animation to an element using the [@triggerName] syntax
//     trigger('fadeInAnimation', [

//         // route 'enter' transition
//         transition(':enter', [

//             // css styles at start of transition
//             style({ opacity: 0 }),

//             // animation and styles at end of transition
//             animate('.3s', style({ opacity: 1 }))
//         ]),
//     ]);
import { DateTime } from 'luxon';
import {state} from './etakstart.service';
import { NavigationEnd, NavigationError, NavigationStart, Event } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // animation triggers go here
  ]
})

export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BKvPIvscs3NtBQfYY2Tx6zFlCvJ_rk0M4wHinlBzCqViCgSord5VGEEzY3y-54n8wfyb2bw8AOJsxl4g_nxQaqc';
  title = 'mis-community';
  user = new User();
  token = this.cookieService.get('etak-start-token') || '';
  id: number;
  userObj: any;
  userObjHomepage: any;
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
  spinner = 1;
  spinnerMain = 1;
  constructor(private cookieService: CookieService,private swPush: SwPush,private communityService: CommunityService,public router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show loading indicator
          this.spinnerMain = 1;
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          setTimeout(()=>{
            this.spinnerMain = 0;
          },2000)
          
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
  });
  }

  ngOnInit(): void {
    if(this.token !== ''){
      // this.getusers();
    }
    // this.subscribeToNotifications()

    this.loadData(); 
setInterval(()=>{
  this.loadData();
},300000)
  }
  loadData(){
    let newState = {
      Users: [],
      userObj: {},
      Cybers: [],
      Events: [],
      Articles: [],
      KYCCArticles: []
    }
    this.communityService.getAllCybers().subscribe(data =>{
      this.Cybers = data;
      this.Cybers = this.shuffleArray(this.Cybers)
      newState.Cybers = this.Cybers
    },error =>{
      this.spinner = 0;
      console.log(error)
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
      newState.Events = this.Events
    },error =>{
      this.spinner = 0;
      console.log(error)
    })
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
      newState.Articles = this.Articles
      console.log(state)
    },error =>{
      this.spinner = 0;
      console.log(error)
    })
    this.communityService.getKYCCArticles().subscribe(data =>{
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
     
      this.KYCCArticles = this.shuffleArray(data);
      newState.KYCCArticles = this.KYCCArticles
      console.log(state)
    },error =>{
      this.spinner = 0;
      console.log(error)
    })
    this.spinner = 0;
    this.spinnerMain = 0;
    this.communityService.changeState(newState);
  }
  subscribeToNotifications() {

    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub =>{ 
      // this.newsletterService.addPushSubscriber(sub).subscribe()
    })
    .catch(err => console.error("Could not subscribe to notifications", err));
}
  ngAfterViewInit(): void{
    this.token = this.cookieService.get('etak-start-token');
    if(this.token !== ''){
      this.communityService.getUserDetail(this.token).subscribe(userobj => {
        this.userObj = userobj[0]
        this.communityService.setUserObj(userobj[0])
      });
    }
  }
  onOnChanges(change: SimpleChange): void {
    if(this.token !== '' && this.userObj){
      this.communityService.getUserDetail(this.token).subscribe(userobj => {
        this.userObj = userobj[0]
      });
    }else if (this.token === '' && this.userObj === undefined) {
      this.router.navigate(["/homepage"])
    }
    
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
  addUser(event){
    this.userObj = event;
  }
  async tokenChange(event){
    await this.cookieService.delete('etak-start-token')
    this.userObj = undefined
    this.router.navigate(['homepage'])
    setTimeout(()=>{
      window.location.reload()
    },1000)
  }
  onActivate($event){
  }
}
