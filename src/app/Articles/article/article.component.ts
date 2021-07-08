import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';
import { SimpleChange } from '@angular/core';
import { DateTime } from 'luxon';
import {state} from '../../etakstart.service';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  userObjArticle: any;
  token = this.cookieService.get('etak-start-token') || '';
  Article = {
    fields: {
      inner_content: "",
      user: []
    }
  };
  id: number;
  path: string;
  date;
  metaUrl = window.location.href;
  constructor(private communityService: CommunityService,private route: ActivatedRoute,public router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.id = parseInt(this.router.url.replace("/articles/",""))
    setTimeout(()=>{
      this.userObjArticle = this.communityService.getUserObj()
    },500)
    let ArticleObj = state.Articles.filter(article=> article.pk === this.id)
    if(!ArticleObj[0]){
      ArticleObj = state.KYCCArticles.filter(article=> article.pk === this.id)
    }
    this.Article = ArticleObj[0]
    console.log(this.Article)
    setTimeout(()=>{
          document.getElementById("articleDiv").innerHTML = this.Article.fields.inner_content
    },500)
        
        let path = this.router.url
        let pathArray = path.split('/')
        this.path = pathArray[1].charAt(0).toUpperCase()+pathArray[1].substring(1)
    // this.communityService.getArticle(this.id).subscribe(data =>{
    //   data.forEach(element => {
    //     let now = DateTime.now();
    //   let newDate = DateTime.fromISO(element.fields.date_added);
    //   this.date = now.toLocaleString()
    //   // Make a fuzzy time
    //     var delta = Math.round((now- newDate) / 1000);
    //     var minute = 60,
    //               hour = minute * 60,
    //                 day = hour * 24,
    //             week = day * 7;
    //     var fuzzy;
    //     if (delta < 30) {
    //         fuzzy = 'just now.';
    //         element.fields.date_added = fuzzy;
    //       } else if (delta < minute) {
    //        fuzzy = delta + ' seconds ago.';
    //        element.fields.date_added = fuzzy;
    //       } else if (delta < 2 * minute) {
    //           fuzzy = 'a minute ago.'
    //           element.fields.date_added = fuzzy;
    //        } else if (delta < hour) {
    //           fuzzy = Math.floor(delta / minute) + ' minutes ago.';
    //           element.fields.date_added = fuzzy;
    //       } else if (Math.floor(delta / hour) == 1) {
    //      fuzzy = '1 hour ago.'
    //      element.fields.date_added = fuzzy;
    //       } else if (delta < day) {
    //        fuzzy = Math.floor(delta / hour) + ' hours ago.';
    //        element.fields.date_added = fuzzy;
    //       } else if (delta < day * 2) {
    //        fuzzy = 'yesterday';
    //        element.fields.date_added = fuzzy;
    //       }else {
    //         element.fields.date_added = element.fields.date_added.slice(0 ,10);
    //       }

    //   });
      
    // })
  }
  openAuthorProfile(event){
    this.router.navigate(['profiles',this.Article.fields.user[0]])
  }
}
