import { Component, EventEmitter, Input, OnInit, Output, HostBinding } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from './etakstart.service';
import { User } from './models/users_model';
import {Router, RouterOutlet} from "@angular/router";
import {SwPush} from '@angular/service-worker';
// import { slideInAnimation } from './animations';

import {
  trigger,
    state,
    style,
    animate,
    transition,
    query,
    animateChild,
    group,
  // ...
} from '@angular/animations';
import { SimpleChange } from '@angular/core';

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
  
  constructor(private cookieService: CookieService,private swPush: SwPush,private communityService: CommunityService,public router: Router) { 

  }

  ngOnInit(): void {
    if(this.token !== ''){
      // this.getusers();
    }
    // this.subscribeToNotifications()
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
