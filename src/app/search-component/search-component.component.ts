import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../etakstart.service';
import { DateTime } from 'luxon';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { Console } from 'node:console';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css']
})
export class SearchComponentComponent implements OnInit {
  searchTerm: string;
  searchResults = [];
  originalSearchResults = [];
  isMobileLayout = false;
  date;
  // pagination = [];
  // previousPage = 1;
  // nextPage = 2;
  currentPage: number;
  readOnlyValue = true;
  config: NgbRatingConfig;
  allRates = 0;
  averageRating = 0;
  total = 0;
  searchBar = true;
  constructor(private route: ActivatedRoute,config: NgbRatingConfig,private router: Router,private communityService: CommunityService) { 
    config.max = 5;
  }
  searchResultsChange(results){
    this.searchResults = results
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.group(params)
      this.searchTerm = params['term'];
      this.currentPage = params['pageNumber'];
    });
    // this.searchTerm = this.router.url.split("/")[2]
    // this.currentPage = parseInt(this.router.url.split("/")[3])
    this.communityService.getSearchResults().subscribe(data => {
      if(data[0]){  
      data.forEach(element => {
        if(element.model === 'etak_start_app.cyberevent' || element.model === 'etak_start_app.article'){
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
        }
      });
      // let dataArray = [];
      this.originalSearchResults = this.searchResults
      for(let i=0;i<data.length;i++){
        for (let result in data[i].fields) {
          if(data[i].fields[result] !== null){
            if(data[i].fields[result].toString().toLowerCase().includes(this.searchTerm.toLowerCase())){
            
              if(result === "owner" || result === "user"){
              }else {
                if(this.searchResults.find( element => element === data[i]) === undefined){
                  this.searchResults.push(data[i])
                }
              }
              
            }
          }else {

          }
          
        }
      }
    }
    })
    
    document.getElementById("submitBtn").addEventListener("click",(event)=>{
      
      window.location.reload();
    })
      this.isMobileLayout = window.innerWidth <= 991
      window.onresize = () => {this.isMobileLayout = window.innerWidth <= 991};
  }
  OnDestroy(): void {
    window.location.reload();
  }

  filterByCheckBox(event){
    this.searchBar = false
    if(event.target.value === 'cybersAndPSCafes'){
      document.getElementById("all").removeAttribute("checked")
      let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.cyber");
      this.searchResults = filterSearch;
      setTimeout(()=>{
      this.searchBar = true
      },500)
    }else if (event.target.value === 'events'){
      document.getElementById("all").removeAttribute("checked")
      let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.cyberevent");
      this.searchResults = filterSearch;
      setTimeout(()=>{
        this.searchBar = true
        },500)
    }else if (event.target.value === 'all'){
      this.searchResults = this.originalSearchResults;
      setTimeout(()=>{
        this.searchBar = true
        },500)
    }
    else if (event.target.value === 'articles'){
      let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.article");
      this.searchResults = filterSearch;
      setTimeout(()=>{
        this.searchBar = true
        },500)
    }else if (event.target.value === 'kyccarticles'){
      let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.article" && result.fields.category === "Know Your Content Creator");
      this.searchResults = filterSearch;
      setTimeout(()=>{
        this.searchBar = true
        },500)
    }else if (event.target.value === 'users'){
      let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.customuser");
      this.searchResults = filterSearch;
      setTimeout(()=>{
        this.searchBar = true
        },500)
    }
  }
  resetValues(){
    document.getElementById("allSideBar").innerHTML = 'All';
    document.getElementById("cybersAndPSCafes").innerHTML = "Cybers & PS Cafe's";
    document.getElementById("eventsSideBar").innerHTML = 'Events';
    document.getElementById("articlesSideBar").innerHTML = 'Articles';
    document.getElementById("kyccarticlesSideBar").innerHTML = 'KYCC Articles';
    document.getElementById("usersSideBar").innerHTML = 'Users';
      
  }
  resetClasses(){
    document.getElementById("allSideBar").classList.remove('selected');
    document.getElementById("cybersAndPSCafes").classList.remove('selected');
    document.getElementById("eventsSideBar").classList.remove('selected');
    document.getElementById("articlesSideBar").classList.remove('selected');
    document.getElementById("kyccarticlesSideBar").classList.remove('selected');
    document.getElementById("usersSideBar").classList.remove('selected');
      
  }
  filterBySideBar(event){
    this.searchBar = false
    if(event.target.id === 'cybersAndPSCafes'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>Cybers & PS Cafe's</strong>";
        event.target.classList.add('selected')
        let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.cyber");
        this.searchResults = filterSearch;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
      
    }else if(event.target.id === 'eventsSideBar'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>Events</strong>";
        event.target.classList.add('selected');
        let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.cyberevent");
        this.searchResults = filterSearch;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
    }else if(event.target.id === 'articlesSideBar'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>Articles</strong>";
        event.target.classList.add('selected');
        let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.article");
        this.searchResults = filterSearch;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
    }else if(event.target.id === 'kyccarticlesSideBar'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>KYCC Articles</strong>";
        event.target.classList.add('selected');
        let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.article" && result.fields.category === "Know Your Content Creator");
        this.searchResults = filterSearch;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
    }else if(event.target.id === 'allSideBar'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>All</strong>";
        event.target.classList.add('selected')
        this.searchResults = this.originalSearchResults;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
    }else if(event.target.id === 'usersSideBar'){
      if(event.target.classList.contains('selected')){

      }else {
        this.resetValues();
        this.resetClasses();
        event.target.innerHTML = "<strong>Users</strong>";
        event.target.classList.add('selected')
        let filterSearch = this.originalSearchResults.filter(result => result.model === "etak_start_app.customuser");
        this.searchResults = filterSearch;
        setTimeout(()=>{
          this.searchBar = true
          },500)
      }
    }
    else {

    }
}

  openNav() {
    if(window.innerWidth > 700){
      document.getElementById("searchSidebar").style.width = '350px';
    }else {
      document.getElementById("searchSidebar").style.width = '45%';
    }
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("searchSidebar").style.width = '0px';
  }
}
