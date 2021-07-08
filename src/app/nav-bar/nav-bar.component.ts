import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../etakstart.service';
import { User } from '../models/users_model';
import { DateTime } from 'luxon';
import {state} from '../etakstart.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  token = this.cookieService.get('etak-start-token') || '';
  userObjNav: User;
  // @Input() userObjNav: any;
  searchTerm: string;
  isCyberOwner: boolean;
  dataCount: number;
  @Output() tokenChange = new EventEmitter<any>();
  notificationSwitch = false;
  UserNotifications = [];
  date;
  unreadNotifications=  0;
  Cybers = [];
  constructor(private cookieService: CookieService,private communityService: CommunityService,public router: Router) { }

  ngOnInit(): void {
    document.getElementById("searchFieldForm").setAttribute("style","display: inline-flex;align-items: center;")
    this.dataCount = 15;
    let refreshIntervalId = setInterval(()=>{
      // if(this.userObjNav){
      //   // clearInterval(refreshIntervalId);
      // }else{
        
      // }
      this.checkUser();
    }, 1000);
    
  }
  checkUser(){
    let tempToken = this.cookieService.get('etak-start-token');
      if(tempToken !== ''){
        setTimeout(()=>{
          this.userObjNav = this.communityService.getUserObj();
          this.openNotification()
          if(this.userObjNav.fields.is_cyber_owner === "1"){
            this.communityService.GetCyberOwnerCybers(this.userObjNav.pk).subscribe(cybers =>{
              this.Cybers = cybers;
            },error => {
            })
          }
        },500)
        
        // this.communityService.getUserDetail(this.token).subscribe(data  => {
        //   this.userObjNav = data[0]
        // },error => {
        // })
      }
  }
  openNotification(){
    if(this.userObjNav){
      this.unreadNotifications = 0;
      this.communityService.GetUserNotifications(this.userObjNav.pk).subscribe(data =>{
        this.notificationSwitch = true;
        if(data.message){
  
        }else{
          data.forEach(element => {
          
            if(element.fields.read === "0"){
                this.unreadNotifications++;
            }
            let now = DateTime.now();
          let newDate = DateTime.fromISO(element.fields.date_added);
          this.date = now.toLocaleString()
          // Make a fuzzy time
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
          this.UserNotifications = data
        }
        
       
        
      })
      setInterval(()=>{
        this.openNotification();
      },1000*60*5)
    }else {
      setInterval(()=>{
        this.openNotification();
      },1000*60*5)
    }
   
  }
  openMyProfile(event){

    this.router.navigate(['profiles',this.userObjNav.pk]).then(()=>{
      // window.location.reload();
    })

  }
  openSettings(event){

    this.router.navigate(['edit-profile-info',this.userObjNav.pk]).then(()=>{
      // window.location.reload();
    })

  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(this.userObjNav && !this.isCyberOwner){
      if(this.userObjNav.fields.is_cyber_owner === '1'){
        this.isCyberOwner = true;
      }else {
        this.isCyberOwner = false;
      }
      this.openNotification();
      // *60*5
    }
   
    
}
markAsRead(event,notification_id){
  document.getElementById("notif_"+notification_id).style.fontWeight = '100';
  if(this.unreadNotifications !== 0){
    this.unreadNotifications--;
  }
  
  // event.target.classList.remove('unread')
  this.communityService.markAsRead(notification_id,this.userObjNav.pk).subscribe(data =>{
    this.UserNotifications.forEach(element =>{
      if(element.pk === data[0].pk){
        element = data[0]
      }

    })
  })
}
  async logout(event){
    setTimeout(()=>{
      this.communityService.deleteToken().then(()=>{
        window.location.reload()
      })
      // this.router.navigate(['homepage']).then(()=>{
      //   window.location.reload()
      // })
      
    },2000)
    
  }
  showSearch(event){
    document.getElementById("searchFieldForm").setAttribute("style","display: none;");
    if(document.getElementById("searchFieldForm").getAttribute("style") === 'display: none;'){
      document.getElementById("searchFieldForm").setAttribute("style","display: inline-flex;align-items: center;");
    }else {
      document.getElementById("searchFieldForm").setAttribute("style","display: none;");
    }
    
  }
  searchTermUpdate(event){
    this.searchTerm = event.target.value;
  }
  doSearch(event){
    this.router.navigate(['/search'], { queryParams: { term: this.searchTerm,pageNumber: '1' } });
  }
  navigateToHomepage(event){
    this.router.navigate(['homepage']);
  }
  navigateToCybersAll(event){
    this.router.navigate(['/places-all'], { queryParams: { pageNumber: '1' } });
  }
  navigateToEventsAll(event){
    this.router.navigate(['/events-all'], { queryParams: { pageNumber: '1' } });
  }
  navigateToArticlesAll(event){
    this.router.navigate(['/all-articles'], { queryParams: { pageNumber: '1' } });
  }
  navigateToKnowYourCreator(event){
    this.router.navigate(['/know-your-content-creator-articles'], { queryParams: { pageNumber: '1' } });
  }
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
openNav() {
  if(window.innerWidth > 700){
    document.getElementById("mySidebar").style.width = '350px';
  }else {
    document.getElementById("mySidebar").style.width = '80%';
  }
  // document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
closeNav() {
  document.getElementById("mySidebar").style.width = '0px';
  // document.getElementById("main").style.marginLeft = "0";
}
}
