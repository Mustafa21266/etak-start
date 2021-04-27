import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DateTime } from 'luxon';
import { newArray } from '@angular/compiler/src/util';
@Component({
  selector: 'app-know-your-content-creator-articles',
  templateUrl: './know-your-content-creator-articles.component.html',
  styleUrls: ['./know-your-content-creator-articles.component.css']
})
export class KnowYourContentCreatorArticlesComponent implements OnInit {
  Articles = [];
  originalArticles = [];
  date;
  constructor(private elRef:ElementRef,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,private cookieService: CookieService) { }
  searchResultsChange(results){
    this.Articles = results
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
  ngOnInit(): void {
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
     
      this.Articles = this.shuffleArray(data);
      this.originalArticles = data;
    })
  }
  cardMouseEnter(event){
    event.target.style.filter = 'opacity(60%)';
    
  }
  cardMouseLeave(event){
    event.target.style.filter = 'opacity(100%)';
  }

}