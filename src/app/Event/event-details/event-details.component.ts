import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';
import { DateTime } from 'luxon';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  userObjEventDetails: any;
  eventId;
  eventObj;
  cyber;
  date;
  token = this.cookieService.get('etak-start-token') || '';
  constructor(private communityService: CommunityService,private cookieService: CookieService,private route: ActivatedRoute,private router: Router,private elRef:ElementRef) { }

  ngOnInit(): void {
    this.eventId = parseInt(this.router.url.replace("/event-details/",""));
    this.getCyberEventDetails();
  }
  getCyberEventDetails(){
    this.communityService.getCyberEventDetails(this.eventId).subscribe(data => {
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
      this.eventObj = data;
      this.communityService.getCyberDetails(this.eventObj[0].fields.cyber[0]).subscribe(data => {
        this.cyber = data
        if(this.token !== ''){
          setTimeout(()=>{
            this.userObjEventDetails = this.communityService.getUserObj()
          },500)
        }
      })
    })
  }

  showFullDiscription(event){
    let parent = event.target.parentNode;
    event.target.parentNode.textContent =  this.eventObj[0].fields.description
    let readLessElm = document.createElement('a');
    readLessElm.style.color = 'blue';
    readLessElm.style.cursor = 'pointer';
    readLessElm.id = 'readLess';
    readLessElm.textContent = ' Read Less'
    parent.appendChild(readLessElm);
    this.elRef.nativeElement.querySelector('#readLess').addEventListener('click', 
  this.onClickReadLess.bind(this));


  }
  onClickReadLess(event){
    let parent = event.target.parentNode;
    event.target.parentNode.textContent =  this.eventObj[0].fields.description.substring(0,350);
    let readLessElm = document.createElement('a');
    readLessElm.style.color = 'blue';
    readLessElm.style.cursor = 'pointer';
    readLessElm.id = 'readMore';
    readLessElm.textContent = ' Read More'
    parent.appendChild(readLessElm);
    this.elRef.nativeElement.querySelector('#readMore').addEventListener('click', 
  this.showFullDiscription.bind(this));


  }
}
