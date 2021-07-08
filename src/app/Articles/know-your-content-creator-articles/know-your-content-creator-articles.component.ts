import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DateTime } from 'luxon';
import { newArray } from '@angular/compiler/src/util';
import {state} from '../../etakstart.service';
@Component({
  selector: 'app-know-your-content-creator-articles',
  templateUrl: './know-your-content-creator-articles.component.html',
  styleUrls: ['./know-your-content-creator-articles.component.css']
})
export class KnowYourContentCreatorArticlesComponent implements OnInit {
  Articles = [];
  originalArticles = [];
  date;
  spinner = 0;
  KYCCArticles = [];
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
    this.spinner = 1;
    
    this.Articles = state.KYCCArticles
    this.originalArticles = state.KYCCArticles
    this.spinner = 0;
  }
  cardMouseEnter(event){
    event.target.style.filter = 'opacity(60%)';
    
  }
  cardMouseLeave(event){
    event.target.style.filter = 'opacity(100%)';
  }

}
